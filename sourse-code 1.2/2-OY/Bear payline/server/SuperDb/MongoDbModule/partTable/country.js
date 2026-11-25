var searchError = require('../../../resurs/funtion/erors');
const { toNum, safeDoc, safeFilter } = require('../safe');

function Country(db) { //getCountryForObj
    this.getCountryForObj = async(obj) => {
        const result = await db.findOne(safeFilter(obj), { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`Davlat topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getCountry = async(id) => {
        const result = await db.findOne({ id: toNum(id) }, { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`Davlat topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getCountryAll = async() => {
        const result = await db.find({}, { projection: { _id: 0 } })
            .sort({ name: 1 }).toArray()
        return result;
    }
    this.addCountry = async(country) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        const result = await db
            .insertOne(country)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.update = async(id, country) => {
        const result = await db
            .updateMany({ id: toNum(id) }, {
                $set: safeDoc(country),
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const countryx = await this.getCountry(id);
        return countryx;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: toNum(id) })
        return result;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = Country;
/*
getCountry()
getCountryAll()
addCountry()
update()
delete()
*/