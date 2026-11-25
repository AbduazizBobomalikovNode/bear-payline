// Message: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function Message(db) {
    const t = makeTable(db, "message");
    this.getMessage = async(id) => t.one('id', id);
    this.getMessageForTo = async(id) => t.many('to_user', id);
    this.getMessageForFrom = async(id) => t.many('from_user', id);
    this.getMessageAll = async() => t.all();
    this.addMessage = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = Message;
