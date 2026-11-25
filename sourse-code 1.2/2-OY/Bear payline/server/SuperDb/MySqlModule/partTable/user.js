// user: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function user(db) {
    const t = makeTable(db, "user");
    this.getUser = async(id) => t.one('id', id);
    this.getUserRole = async(id) => t.many('idrole', id);
    this.getUserCountry = async(id) => t.many('idcountry', id);
    this.getUserAll = async() => t.all();
    this.addUser = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = user;
