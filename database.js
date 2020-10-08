const fs = require('fs')

const DB_FILE = './database.json'

async function store(business_uid, token) {
    await fs.writeFileSync(DB_FILE, JSON.stringify({business_uid: business_uid, token: token}, null, 2) , 'utf-8')
}

function load() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE))
    } catch {
        return null
    }
}

async function clear() {
    try {
        await fs.unlinkSync(DB_FILE)
    } catch {
    }
}

module.exports.store = store
module.exports.load = load
module.exports.clear = clear