var searchError = require('../../../resurs/funtion/erors');

function User(db) { //getUserForObj
    this.getUser = async(id) => {
        const result = await db.findOne({ id: id }, { projection: { _id: 0 } })
            .then(resultin => {
                return resultin;
            })
            .catch(err => {
                console.error(`Foydalanuvchi topilmadi: ${err}`)
                return false;
            });
        return result;
    }
    this.getUserForObj = async(obj) => {
        const result = await db.findOne(obj, { projection: { _id: 0 } })
            .then(resultin => {
                return resultin;
            })
            .catch(err => {
                console.error(`Foydalanuvchi topilmadi: ${err}`)
                return false;
            });
        return result;
    }
    this.getUserRole = async(id) => {
        const result = await db.find({ idrole: id }, { projection: { _id: 0 } })
            .sort({ full_name: 1, phone: 1, idcountry: 1 }).toArray()
        return result;
    }

    this.getUserCountry = async(id) => {
        const result = await db.find({ idcountry: id }, { projection: { _id: 0 } })
            .sort({ full_name: 1, phone: 1, idcountry: 1 }).toArray()
        return result;
    }
    this.getUserAll = async() => {
        //.sort({ full_name: 1, phone: 1, idcountry: 1 })
        const result = await db.find({}, { projection: { _id: 0 } })
            .toArray()
        return result;
    }
    this.addUser = async(user) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        const result = await db
            .insertOne(user)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.update = async(id, user) => {
        const result = await db
            .updateMany({ id: id }, {
                $set: user,
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const userx = await this.getUser(id);
        return userx;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: id })
        return result;
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
module.exports = User;
/*
getUser()
getUserRole()
getUserCountry()
getUserAll()
addUser()
update()
delete()
*/