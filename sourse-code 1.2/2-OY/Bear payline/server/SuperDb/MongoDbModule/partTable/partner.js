var searchError = require('../../../resurs/funtion/erors');
const { toNum, safeDoc, safeFilter } = require('../safe');

function Partner(db) {
    this.getPartner = async(id) => {
        const result = await db.findOne({ id: toNum(id) }, { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`Do'st topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getPartnerUser = async(id) => { //iduser
        const result = await db.find({ iduser: toNum(id) }, { projection: { _id: 0 } })
            .sort({ name: 1 }).toArray()
        return result;
    }
    this.getPartnerAll = async() => {
        const result = await db.find({}, { projection: { _id: 0 } })
            .sort({ name: 1 }).toArray()
        return result;
    }
    this.addPartner = async(partner) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        const result = await db
            .insertOne(partner)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.update = async(id, partner) => {
        const result = await db
            .updateMany({ id: toNum(id) }, {
                $set: safeDoc(partner),
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const partnerx = await this.getPartner(id);
        return partnerx;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: toNum(id) })
        return result;
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
module.exports = Partner;
/*
getPartner()
getPartnerUser()
getPartnerAll()
addPartner()
update()
delete()
*/