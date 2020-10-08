const axios = require('axios')
const jwt = require('jsonwebtoken')
const db = require('./database')

function getCallbackURL(req) {
    const host = req.get('host')
    return `http://${host}/callback`
}

module.exports = (app, env, clientID, clientSecret) => {

    app.get('/status', (req, res) => {
        const info = db.load()
        if (info)
            res.send(info)
        else
            res.send({})
    })

    app.post('/uninstall', (req, res) => {
        db.clear()
        res.send({})
    })

    app.get('/install', (req, res) => {
        let url = `${env.auth_server}/app/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=${getCallbackURL(req)}`
        res.redirect(url)
    })

    app.get('/callback', async (req, res) => {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        let params = {
            grant_type: 'authorization_code',
            code: req.query.code,
            client_id: clientID,
            client_secret: clientSecret,
            redirect_uri: getCallbackURL(req),
        }
        try {
            let result = await axios.post(`${env.api_server}/oauth/token`, params, {headers: headers})
            let token = result.data.access_token
            const business_uid = jwt.decode(result.data.id_token).business_id
            db.store(business_uid, token)

            res.redirect('/')
        } catch (error) {
            console.log('error', error)
            res.json({params: params, error: error})
        }
    })

    app.get('/clients', async (req, res) => {
        try {
            let token = req.query.token
            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }

            let result = await axios.get(`${env.api_server}/platform/v1/clients`, {headers: headers})
            res.send(result.data.data)
        } catch (error) {
            console.log('error', error)
            res.json({error: error})
        }
    })

    app.get('/user_info', async (req, res) => {
        try {
            let token = req.query.token
            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }

            let result = await axios.get(`${env.api_server}/oauth/userinfo`, {headers: headers})
            res.send(result.data)
        } catch (error) {
            console.log('error', error)
            res.json({error: error})
        }
    })
}

