// News: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function News(db) {
    const t = makeTable(db, "news");
    this.getNews = async(id) => t.one('id', id);
    this.getNewsAll = async() => t.all();
    this.addNews = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = News;
