function user(db) {
    this.getUser = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM user WHERE id='" + id + "'", function(err, result, fields) {
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
    this.getUserRole = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM user WHERE idrole='" + id + "'", function(err, result, fields) {
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

    this.getUserCountry = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM user WHERE idcountry = '" + id + "'", function(err, result, fields) {
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
    this.getUserAll = async() => {
        var myResult = null;
        db.query("SELECT * FROM user", function(err, result, fields) {
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
    this.addUser = async(user) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        var values = "";
        var keys = "";
        var myResult = null;
        for (const key in user) {
            if (Object.hasOwnProperty.call(user, key)) {
                values += '"' + user[key] + '" ,';
                keys += key + ",";
            }
        }

        var sql = 'INSERT INTO user (' + keys + ') VALUES(' + values + ')';
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
    this.update = async(id, user) => {
        var myResult = null;

        var sql = 'UPDATE user SET ';
        for (const key in user) {
            if (Object.hasOwnProperty.call(user, key)) {
                if (typeof user[key] == 'string') {
                    sql += key + ' = "' + user[key] + '" ,';
                } else {
                    sql += key + ' = ' + user[key] + ' ,';
                }
            }
        }
        if (sql.endsWith(',')) {
            sql = sql.slice(0, -1);
        }
        sql += ' WHERE id = ' + id;
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
        return this.getUser(id);
    }
    this.delete = async(id) => {
        var myResult = null;
        var sql = "DELETE FROM user WHERE id = " + id;
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
module.exports = user;
/*
getUser()
getUserRole()
getUserCountry()
getUserAll()
addUser()
update()
delete()
*/