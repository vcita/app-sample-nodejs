const express = require('express')
const envs = require('./envs')
const context = require('./context')
const routes = require('./routes')

const env = envs[context.env]
const app = express()

app.use(express.static('public'))

routes(app, env, context.client_id, context.client_secret)

app.listen(context.port, () => console.log(`Sample app available on http://localhost:${context.port}`))
