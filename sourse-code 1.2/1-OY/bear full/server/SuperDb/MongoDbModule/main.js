const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

var db = null;
var sxema = require('./sxema');
const user = require('./partTable/user');
const news = require('./partTable/news');
const country = require('./partTable/country');
const payments = require('./partTable/payments');
const card = require('./partTable/card');
const cardHasUser = require('./partTable/card_has_user');
const partner = require('./partTable/partner');
const role = require('./partTable/role');
const device = require('./partTable/device');
const document = require('./partTable/document');
const cheks = require('./partTable/cheks');

class Db {
    constructor() {
        this.buffer = (async function() {
            await client.connect();
            db = await client.db('bearpayline_test');
            await sxema(db);
            return {
                user: new user(db.collection("user")),
                news: new news(db.collection("news")),
                country: new country(db.collection("country")),
                payments: new payments(db.collection("payments")),
                card: new card(db.collection("card")),
                cardHasUser: new cardHasUser(db.collection("cardHasUser")),
                partner: new partner(db.collection("partner")),
                role: new role(db.collection("role")),
                device: new device(db.collection("device")),
                document: new document(db.collection("document")),
                cheks: new cheks(db.collection("cheks")),
                close: function() {
                    client.close();
                }
            }
        })();
    }
    async Main() {
        return this.buffer;
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
module.exports = new Db().Main();