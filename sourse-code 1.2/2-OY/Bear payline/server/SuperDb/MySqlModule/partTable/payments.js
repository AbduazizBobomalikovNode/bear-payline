// Payments: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function Payments(db) {
    const t = makeTable(db, "payments");
    this.getPayments = async(id) => t.one('id', id);
    this.getPaymentsUser = async(id) => t.many('iduser', id);
    this.getPaymentsAll = async() => t.all();
    this.addPayments = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = Payments;
