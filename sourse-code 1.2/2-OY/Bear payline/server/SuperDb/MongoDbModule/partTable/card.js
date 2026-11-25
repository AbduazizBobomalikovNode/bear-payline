var searchError = require('../../../resurs/funtion/erors');
const { toNum, safeDoc, safeFilter } = require('../safe');

function Card(db) {
    this.getCard = async(id) => {
        const result = await db.findOne({ id: toNum(id) }, { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`karta topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getCardAll = async() => {
        const result = await db.find({}, { projection: { _id: 0 } })
            .toArray()
        return result;
    }
    this.addCard = async(card) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
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
            .updateMany({ id: toNum(id) }, {
                $set: safeDoc(card),
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const cardx = await this.getCard(id);
        return cardx;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: toNum(id) })
        return result;
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
module.exports = Card;
/*
getCard()
getCardAll()
addCard()
update()
delete()
*/