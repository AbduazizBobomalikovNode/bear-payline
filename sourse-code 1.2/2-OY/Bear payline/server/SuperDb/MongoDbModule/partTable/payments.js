var searchError = require('../../../resurs/funtion/erors');
const { toNum, safeDoc, safeFilter } = require('../safe');

function Payments(db) {
    this.getPayments = async(id) => {
        const result = await db.findOne({ id: toNum(id) }, { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`To'lov topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getPaymentsUser = async(id) => { //iduser
        const result = await db.find({ iduser: toNum(id) }, { projection: { _id: 0 } })
            .sort({ date: 1 }).toArray()
        return result;
    }
    this.getPaymentsAll = async() => {
        const result = await db.find({}, { projection: { _id: 0 } })
            .sort({ date: 1, iduser: 1, currency: 1, method: 1 }).toArray()
        return result;
    }
    this.addPayments = async(payments) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        const result = await db
            .insertOne(payments)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.update = async(id, payments) => {
        const result = await db
            .updateMany({ id: toNum(id) }, {
                $set: safeDoc(payments),
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const paymentsx = await this.getPayments(id);
        return paymentsx;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: toNum(id) })
        return result;
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
module.exports = Payments;
/*
getPayments()
getPaymentsUser()
getPaymentsAll()
addPayments()
update()
delete()
*/