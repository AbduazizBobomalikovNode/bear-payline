var mysql = require('mysql');
var db = null;
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
const message = require('./partTable/message');

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "admin",
//     password: "@dm1nb1ll1@rd$r##m",
//     database: "bear"
// });

var con = mysql.createConnection({
    host: "us-cdbr-east-06.cleardb.net",
    user: "b397bf2fb21fb5",
    password: "***REMOVED***",
    database: "heroku_48fdb3a46606ce3"
});

class Db {
    constructor() {
        this.buffer = (async function() {
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
                setInterval(function() {
                    con.query('SELECT 1');
                }, 5000);
            });
            return {
                user: new user(con),
                news: new news(con),
                country: new country(con),
                payments: new payments(con),
                card: new card(con),
                cardHasUser: new cardHasUser(con),
                partner: new partner(con),
                role: new role(con),
                device: new device(con),
                document: new document(con),
                message: new message(con),
                close: function() {
                    con.end();
                }
            }
        })();
    }
    async Main() {

        return this.buffer;
    }
}


module.exports = new Db().Main();