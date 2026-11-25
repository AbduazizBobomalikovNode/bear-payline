// Card_has_user: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function Card_has_user(db) {
    const t = makeTable(db, "card_has_user");
    this.getCardHasUser = async(id) => t.one('id', id);
    this.getCardHasUserForCard = async(id) => t.many('idcard', id);
    this.getCardHasUserForUser = async(id) => t.many('iduser', id);
    this.getCardHasUserAll = async() => t.all();
    this.addCardHasUser = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = Card_has_user;
