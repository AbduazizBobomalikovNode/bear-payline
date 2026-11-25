// Document: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function Document(db) {
    const t = makeTable(db, "document");
    this.getDocument = async(id) => t.one('id', id);
    this.getDocumentUser = async(id) => t.many('iduser', id);
    this.getDocumentAll = async() => t.all();
    this.addDocument = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = Document;
