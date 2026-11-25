var searchError = require('../../../resurs/funtion/erors');
const { toNum, safeDoc, safeFilter } = require('../safe');

function Message(db) {
    this.getMessage = async(id) => {
        const result = await db.findOne({ id: toNum(id) }, { projection: { _id: 0 } })
            .then(resultin => {
                return resultin;
            })
            .catch(err => {
                console.error(`Xabar topilmadi: ${err}`)
                return false;
            });
        return result;
    }
    this.getMessageForObj = async(obj) => {
        const result = await db.find(obj, {
            projection: { _id: 0 }
        }).sort({ date: 1 }).toArray();
        return result;
    }
    this.getMessageForTo = async(id) => {
        const result = await db.find({ to_user: toNum(id) }, { projection: { _id: 0 } })
            .sort({ date: 1 }).toArray()
        return result;
    }
    this.getMessageForFrom = async(id) => {
        const result = await db.find({ from_user: toNum(id) }, { projection: { _id: 0 } })
            .sort({ date: 1 }).toArray()
        return result;
    }


    this.getMessageAll = async() => {
        const result = await db.find({}, { projection: { _id: 0 } })
            .sort({ date: 1, to_user: 1, from_user: 1 })
            .toArray();
        return result;
    }
    this.addMessage = async(message) => {
        const result = await db
            .insertOne(message)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.update = async(id, message) => {
        const result = await db
            .updateMany({ id: toNum(id) }, {
                $set: safeDoc(message),
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const userx = await this.getMessage(id);
        return userx;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: toNum(id) })
        return result;
    }
}


module.exports = Message;

/*
getMessage()
getMessageForObj()
getMessageForTo()
getMessageForFrom()
getMessageAll()
addMessage()
update()
delete()
*/