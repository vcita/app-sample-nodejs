const envs = {
    integration: {
        auth_server: 'http://app.meet2know.com',
        api_server: 'https://api2.meet2know.com/'
    },
    dev: {
        auth_server: 'http://app.dev-vcita.me:7200',
        api_server: 'http://api2.dev-vcita.me:7100'
    },
    production: {
        auth_server: 'http://app.vcita.com',
        api_server: 'https://api2.vcita.com'
    }
}

module.exports = envs
