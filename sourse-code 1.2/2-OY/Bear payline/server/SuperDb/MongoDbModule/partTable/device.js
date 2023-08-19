var searchError = require('../../../resurs/funtion/erors');
// Device
function Device(db) {
    this.getDevice = async(id) => {
        const result = await db.findOne({ id: id }, { projection: { _id: 0 } })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(`Qurilma topilmadi: ${err}`)
                return false;
            })
        return result;
    }
    this.getDeviceUser = async(id) => { //iduser
        const result = await db.find({ iduser: id }, { projection: { _id: 0 } })
            .sort({ date: 1 }).toArray()
        return result;
    }
    this.getDeviceAll = async() => {
        const result = await db.find({}, { projection: { _id: 0 } })
            .sort({ iduser: 1 }).toArray()
        return result;
    }
    this.addDevice = async(device) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        const result = await db
            .insertOne(device)
            .catch((err) => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        return result;
    }
    this.update = async(id, device) => {
        const result = await db
            .updateMany({ id: id }, {
                $set: device,
                $currentDate: { lastModified: true }
            }).catch(err => {
                let error = { error: [] };
                searchError(err, null, error);
                return error;
            });
        const devicex = await this.getDevice(id);
        return devicex;
    }
    this.delete = async(id) => {
        const result = await db.deleteOne({ id: id })
        return result;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = Device;
/*
getDevice()
getDeviceUser()
getDeviceAll()
addDevice()
update()
delete()
*/