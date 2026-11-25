// Partner: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function Partner(db) {
    const t = makeTable(db, "partner");
    this.getPartner = async(id) => t.one('id', id);
    this.getPartnerUser = async(id) => t.many('iduser', id);
    this.getPartnerAll = async() => t.all();
    this.addPartner = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = Partner;
