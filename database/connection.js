var MongoClient = require('mongodb').MongoClient
require('dotenv').config()
class Connection {
    static async open () {
        if(this.db) return this.db
        const url = process.env.MONGOURI
        this.db = await MongoClient.connect(url)
        return this.db
    }
}

Connection.db = null

module.exports = { Connection }