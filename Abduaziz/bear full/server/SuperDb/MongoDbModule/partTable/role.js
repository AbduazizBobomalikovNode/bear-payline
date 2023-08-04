var searchError = require('../../../resurs/funtion/erors');

function Role(db) { //getRoleForObj
    this.getRoleForObj = async(obj) => {
        const result = await db.findOne(obj, { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`Role topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getRole = async(id) => {
        const result = await db.findOne({ id: id }, { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`Role topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getRoleAll = async() => {
        const result = await db.find({}, { projection: { _id: 0 } })
            .sort({ role: 1 }).toArray()
        return result;
    }
    this.addRole = async(role) => {
        const result = await db
            .insertOne(role)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.update = async(id, role) => {
        const result = await db
            .updateMany({ id: id }, {
                $set: role,
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const rolex = await this.getRole(id);
        return rolex;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: id })
        return result;
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
module.exports = Role;
/*
getRole()
getRoleAll()
addRole()
update()
delete()
*/