var searchError = require('../../../resurs/funtion/erors');
const { toNum, safeDoc, safeFilter } = require('../safe');

function Cheks(db) { //getUserForObj
    this.getCheks = async(id) => {
        const result = await db.findOne({ id: toNum(id) }, { projection: { _id: 0 } })
            .then(resultin => {
                return resultin;
            })
            .catch(err => {
                console.error(`tasdiqlash topilmadi: ${err}`)
                return false;
            });
        
        return result;
    }
    this.addCheks = async(chek) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        const result = await db
            .insertOne(chek)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: toNum(id) })
        return result;
    }
}


module.exports = Cheks;