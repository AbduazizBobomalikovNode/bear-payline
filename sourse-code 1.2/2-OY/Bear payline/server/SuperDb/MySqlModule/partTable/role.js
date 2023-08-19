function Role(db) {
    this.getRole = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM role  WHERE id='" + id + "'", function(err, result, fields) {
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
    this.getRoleAll = async() => {
        var myResult = null;
        db.query("SELECT * FROM role ", function(err, result, fields) {
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
    this.addRole = async(role) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        var values = "";
        var keys = "";
        var myResult = null;
        for (const key in role) {
            if (Object.hasOwnProperty.call(role, key)) {
                values += '"' + role[key] + '" ,';
                keys += key + ",";
            }
        }

        var sql = 'INSERT INTO role (' + keys + ') VALUES(' + values + ')';
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
    this.update = async(id, role) => {
        var myResult = null;
        var sql = 'UPDATE role SET ';
        for (const key in role) {
            if (Object.hasOwnProperty.call(role, key)) {
                if (typeof role[key] == 'string') {
                    sql += key + '= "' + role[key] + '"';
                } else {
                    sql += key + '= ' + role[key] + ' ';
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
        return this.getRole(id);
    }
    this.delete = async(id) => {
        var myResult = null;
        var sql = "DELETE FROM role WHERE id = " + id;
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
module.exports = Role;
/*
getRole()
getRoleAll()
addRole()
update()
delete()
*/