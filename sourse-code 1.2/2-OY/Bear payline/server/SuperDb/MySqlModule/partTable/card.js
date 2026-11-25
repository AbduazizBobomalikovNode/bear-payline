// Card: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function Card(db) {
    const t = makeTable(db, "card");
    this.getCard = async(id) => t.one('id', id);
    this.getCardAll = async() => t.all();
    this.addCard = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = Card;
