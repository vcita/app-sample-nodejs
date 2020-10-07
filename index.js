const express = require('express')
const exphbs = require('express-handlebars')
const envs = require('./envs')
const context = require('./context')
const routes = require('./routes')

const env = envs[context.env]
const app = express()

var hbs = exphbs.create({
    helpers: {
      toJSON : function(object) {
          return JSON.stringify(object, undefined, 2).replace(/\n/g, "<br>").
            replace(/[ ]/g, "&nbsp;");
      }
    },
    defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

routes(app, env, context.client_id, context.client_secret)

app.listen(context.port, () => console.log(`Sample app available on http://localhost:${context.port}`))
