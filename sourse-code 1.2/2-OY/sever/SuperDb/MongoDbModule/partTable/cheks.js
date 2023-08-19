var searchError = require('../../../resurs/funtion/erors');

function Cheks(db) { //getUserForObj
    this.getCheks = async(id) => {
        const result = await db.findOne({ id: id }, { projection: { _id: 0 } })
            .then(resultin => {
                return resultin;
            })
            .catch(err => {
                console.error(`tasdiqlash topilmadi: ${err}`)
                return false;
            });
        console.log("getCheks ishladi", result, id);
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
        const result = await db.deleteOne({ id: id })
        return result;
    }
}


module.exports = Cheks;