var searchError = require('../../../resurs/funtion/erors');
// Document
function Document(db) {
    this.getDocument = async(id) => {
        const result = await db.findOne({ id: id }, { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`Hujat topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getDocumentUser = async(id) => { //iduser
        const result = await db.find({ iduser: id }, { projection: { _id: 0 } })
            .toArray()
        return result;
    }
    this.getDocumentAll = async() => {
        const result = await db.find({}, { projection: { _id: 0 } })
            .toArray()
        return result;
    }
    this.addDocument = async(document) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        const result = await db
            .insertOne(document)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.update = async(id, document) => {
        const result = await db
            .updateMany({ id: id }, {
                $set: document,
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const documentx = await this.getDocument(id);
        return documentx;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: id })
        return result;
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
module.exports = Document;
/*
getDocument()
getDocumentUser()
getDocumentAll()
addDocument()
update()
delete()
*/