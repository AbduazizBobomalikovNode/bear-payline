var searchError = require('../../../resurs/funtion/erors');

function Card_has_user(db) {
    this.getCardHasUser = async(id) => {
        const result = await db.findOne({ id: id }, { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`ushbu foydaluchiga mos karta topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getCardHasUserForCard = async(id) => { //idcard
        const result = await db.find({ idcard: id }, { projection: { _id: 0 } })
            .sort({ idcard: 1 }).toArray()
        return result;
    }
    this.getCardHasUserForUser = async(id) => { //iduser
        const result = await db.find({ iduser: id }, { projection: { _id: 0 } })
            .sort({ iduser: 1 }).toArray()
        return result;
    }
    this.getCardHasUserAll = async() => {
        const result = await db.find({}, { projection: { _id: 0 } })
            .sort({ iduser: 1 }).toArray()
        return result;
    }
    this.addCardHasUser = async(card) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        const result = await db
            .insertOne(card)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.update = async(id, card) => {
        const result = await db
            .updateMany({ id: id }, {
                $set: card,
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const cardx = await this.getCardHasUser(id);
        return cardx;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: id })
        return result;
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
module.exports = Card_has_user;
/*
getCardHasUser()
getCardHasUserForCard()
getCardHasUserForUser()
getCardHasUserAll()
addCardHasUser()
update()
delete()
*/