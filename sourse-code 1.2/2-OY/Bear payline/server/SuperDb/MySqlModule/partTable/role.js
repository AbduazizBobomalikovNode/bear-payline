// Role: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function Role(db) {
    const t = makeTable(db, "role");
    this.getRole = async(id) => t.one('id', id);
    this.getRoleAll = async() => t.all();
    this.addRole = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = Role;
