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
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE
// });

var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
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