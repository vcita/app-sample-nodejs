const axios = require('axios')

function getCallbackURL(req) {
    const host = req.get('host')
    return `http://${host}/callback`
}

module.exports = (app, env, clientID, clientSecret) => {

    app.get('/', (req, res) => {
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
            res.render('callback', {title: 'Authorized', token: token})
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
            let info = result.data
            res.render('clients', {title: 'Clients', token: token, info: info})
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
            let info = result.data

            res.render('user_info', {title: 'User Info', token: token, info: info})
        } catch (error) {
            console.log('error', error)
            res.json({error: error})
        }
    })
}

