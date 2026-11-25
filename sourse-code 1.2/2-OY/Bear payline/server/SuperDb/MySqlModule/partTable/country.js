// Country: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function Country(db) {
    const t = makeTable(db, "сountry");
    this.getCountry = async(id) => t.one('id', id);
    this.getCountryAll = async() => t.all();
    this.addCountry = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = Country;
