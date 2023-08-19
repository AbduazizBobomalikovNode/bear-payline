function Partner(db) {
    this.getPartner = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM partner  WHERE id='" + id + "'", function(err, result, fields) {
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
    this.getPartnerUser = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM partner  WHERE iduser='" + id + "'", function(err, result, fields) {
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
    this.getPartnerAll = async() => {
        var myResult = null;
        db.query("SELECT * FROM partner ", function(err, result, fields) {
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
    this.addPartner = async(partner) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        var values = "";
        var keys = "";
        var myResult = null;
        for (const key in partner) {
            if (Object.hasOwnProperty.call(partner, key)) {
                values += '"' + partner[key] + '" ,';
                keys += key + ",";
            }
        }

        var sql = 'INSERT INTO partner (' + keys + ') VALUES(' + values + ')';
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
    this.update = async(id, partner) => {
        var myResult = null;
        var sql = 'UPDATE partner SET ';
        for (const key in partner) {
            if (Object.hasOwnProperty.call(partner, key)) {
                if (typeof partner[key] == 'string') {
                    sql += key + '= "' + partner[key] + '"';
                } else {
                    sql += key + '= ' + partner[key] + ' ';
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
        return this.getPartner(id);
    }
    this.delete = async(id) => {
        var myResult = null;
        var sql = "DELETE FROM partner WHERE id = " + id;
        db.query(sql, function(err, result) {
            if (err) {
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
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = Partner;
/*
getPartner()
getPartnerUser()
getPartnerAll()
addPartner()
update()
delete()
*/