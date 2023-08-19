var searchError = require('../../../resurs/funtion/erors');

function News(db) {
    this.getNews = async(id) => {
        const result = await db.findOne({ id: id }, { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`Reklama topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getNewsAll = async() => {
        const result = await db.find({}, { projection: { _id: 0 } })
            .toArray()
        return result;
    }
    this.addNews = async(news) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        const result = await db
            .insertOne(news)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.update = async(id, news) => {
        const result = await db
            .updateMany({ id: id }, {
                $set: news,
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const newsx = await this.getNews(id);
        return newsx;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: id });
        return result;
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
module.exports = News;
/*
getNews()
getNewsAll()
addNews()
update()
delete()
*/