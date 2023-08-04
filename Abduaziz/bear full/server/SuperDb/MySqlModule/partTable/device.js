// Device
function Device(db) {
    this.getDevice = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM device  WHERE id='" + id + "'", function(err, result, fields) {
            if (err) {
                console.log(err.sqlMessage);
                myResult = [false];
            } else myResult = result;
        });
        while (myResult == null) {
            await sleep(5);
        }
        return myResult[0];
    }
    this.getDeviceUser = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM device  WHERE iduser ='" + id + "'", function(err, result, fields) {
            if (err) {
                console.log(err.sqlMessage);
                myResult = [false];
            } else myResult = result;
        });
        while (myResult == null) {
            await sleep(5);
        }
        return myResult[0];
    }
    this.getDeviceAll = async() => {
        var myResult = null;
        db.query("SELECT * FROM device ", function(err, result, fields) {
            if (err) {
                console.log(err);
                myResult = false;
            } else myResult = result;
        });
        while (myResult == null) {
            await sleep(5);
        }
        return myResult;
    }
    this.addDevice = async(device) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        var values = "";
        var keys = "";
        var myResult = null;
        for (const key in device) {
            if (Object.hasOwnProperty.call(device, key)) {
                values += '"' + device[key] + '" ,';
                keys += key + ",";
            }
        }

        var sql = 'INSERT INTO device (' + keys + ') VALUES(' + values + ')';
        sql = sql.replaceAll(',)', ')');
        db.query(sql, function(err, result) {
            if (err) {
                console.log(err.sqlMessage);
                myResult = {
                    error: {
                        message: err.sqlMessage
                    }
                };
            } else myResult = result;
        });
        while (myResult == null) {
            await sleep(5);
        }
        return myResult;
    }
    this.update = async(id, device) => {
        var myResult = null;
        var sql = 'UPDATE device SET ';
        for (const key in device) {
            if (Object.hasOwnProperty.call(device, key)) {
                if (typeof device[key] == 'string') {
                    sql += key + '= "' + device[key] + '"';
                } else {
                    sql += key + '= ' + device[key] + ' ';
                }
            }
        }
        sql += 'WHERE id =' + id;
        db.query(sql, function(err, result) {
            if (err) {
                console.log(err.sqlMessage);
                myResult = {
                    error: {
                        message: err.sqlMessage
                    }
                };
            } else myResult = result;
        });
        while (myResult == null) {
            await sleep(5);
        }
        return this.getDevice(id);
    }
    this.delete = async(id) => {
        var myResult = null;
        var sql = "DELETE FROM device WHERE id = " + id;
        db.query(sql, function(err, result) {
            if (err) {
                console.log(err.sqlMessage);
                myResult = false;
            } else myResult = result;
        });
        while (myResult == null) {
            await sleep(5);
        }
        return myResult;
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