const express = require('express')
const exphbs = require('express-handlebars')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 44444

const clientID = 'client'
const clientSecret = 'secret'

// Dev
const authServer = 'http://app.dev-vcita.me:7200'
// Integration
// const authServer = 'http://app.meet2know.com'
// Production
// const serverFrontage = 'http://app.vcita.com'
const authorizeUri = '/app/oauth/authorize'

// Define api server URLs (Core in dev, API Gateway in int, prod)
// Dev
const apiServer = 'http://localhost:7100'
// Integration
// const apiServer = 'https://api-int.vchost.co/'
// Production
// const apiServer = 'http://api.vcita.biz'
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
  let url = `${authServer}${authorizeUri}?response_type=code&client_id=${clientID}&redirect_uri=${callbackURL}`
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
    let result = await axios.post(`${apiServer}${tokenUri}`, params, { headers: headers })
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

    let result = await axios.get(`${apiServer}${clientsRetrieveUri}`, { headers: headers })
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

    let result = await axios.get(`${apiServer}${userInfoUri}`, { headers: headers })
    let info = result.data

    res.render('user_info', { title: 'User Info', token: token, info: info })
  } catch (error) {
    console.log('error', error)
    res.json({ error: error })
  }
})

app.listen(port, () => console.log(`Sample app listening on port ${port}!`))
