const express = require('express')
const exphbs = require('express-handlebars')
const axios = require('axios')
const env = require('./envs')["integration"]

const app = express()
const port = process.env.PORT || 44444

const clientID = 'client'
const clientSecret = 'secret'

const authorizeUri = '/app/oauth/authorize'
const tokenUri = '/oauth/token'
const clientsRetrieveUri = '/platform/v1/clients'
const userInfoUri = '/oauth/userinfo'

var hbs = exphbs.create({
    helpers: {
      toJSON : function(object) {
        var results =  JSON.stringify(object, undefined, 2);
        var results2 = results.replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
        return results2
      }
    },
    defaultLayout: 'main'
});

app.set('json spaces', 2)
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

const getCallbackURL = req => {
  const host = req.get('host')
  return `http://${host}/callback`
}

app.get('/', (req, res) => {
  let callbackURL = getCallbackURL(req)
  let url = `${env.auth_server}${authorizeUri}?response_type=code&client_id=${clientID}&redirect_uri=${callbackURL}`
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
    let result = await axios.post(`${env.api_server}${tokenUri}`, params, { headers: headers })
    let token = result.data.access_token
    res.render('callback', { title: 'Authorized', token: token })
  } catch (error) {
    console.log('error', error)
    res.json({ params: params, error: error })
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

    let result = await axios.get(`${env.api_server}${clientsRetrieveUri}`, { headers: headers })
    let info = result.data
    res.render('clients', { title: 'Clients', token: token, info: info })
  } catch (error) {
    console.log('error', error)
    res.json({ error: error })
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

    let result = await axios.get(`${env.api_server}${userInfoUri}`, { headers: headers })
    let info = result.data

    res.render('user_info', { title: 'User Info', token: token, info: info })
  } catch (error) {
    console.log('error', error)
    res.json({ error: error })
  }
})

app.listen(port, () => console.log(`Sample app listening on port ${port}!`))
