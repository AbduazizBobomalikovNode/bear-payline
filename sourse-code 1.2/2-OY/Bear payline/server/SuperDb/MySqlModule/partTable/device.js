// Device: parametrlangan so'rovlar (../sql.js)
const { makeTable } = require('../sql');

function Device(db) {
    const t = makeTable(db, "device");
    this.getDevice = async(id) => t.one('id', id);
    this.getDeviceUser = async(id) => t.many('iduser', id);
    this.getDeviceAll = async() => t.all();
    this.addDevice = async(row) => t.insert(row);
    this.update = async(id, row) => t.update(id, row);
    this.delete = async(id) => t.remove(id);
}
module.exports = Device;
