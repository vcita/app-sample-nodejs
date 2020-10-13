const fs = require('fs')

const DB_FILE = './database.json'

module.exports = {
    store: async (business_uid, token) => {
        await fs.writeFileSync(DB_FILE, JSON.stringify({business_uid: business_uid, token: token}, null, 2), 'utf-8')
    },
    load: () => {
        try {
            return JSON.parse(fs.readFileSync(DB_FILE))
        } catch {
            return null
        }
    },
    clear: async () => {
        try {
            await fs.unlinkSync(DB_FILE)
        } catch {
            return
        }
    }
}