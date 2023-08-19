const sleep = require("../../../resurs/funtion/sleep");

function Message(db) {
    this.getMessage = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM message WHERE id='" + id + "'", function(err, result, fields) {
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
    this.getMessageForTo = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM message WHERE to_user ='" + id + "'", function(err, result, fields) {
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
    this.getMessageForFrom = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM message WHERE from_user = '" + id + "'", function(err, result, fields) {
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
    this.getMessageAll = async() => {
        var myResult = null;
        db.query("SELECT * FROM message", function(err, result, fields) {
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
    this.addMessage = async(message) => {
        var values = "";
        var keys = "";
        var myResult = null;
        for (const key in message) {
            if (Object.hasOwnProperty.call(message, key)) {
                values += '"' + message[key] + '" ,';
                keys += key + ",";
            }
        }

        var sql = 'INSERT INTO message (' + keys + ') VALUES(' + values + ')';
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
    this.update = async(id, message) => {
        var myResult = null;
        var sql = 'UPDATE message SET ';
        for (const key in message) {
            if (Object.hasOwnProperty.call(message, key)) {
                if (typeof message[key] == 'string') {
                    sql += key + ' = "' + message[key] + '" ,';
                } else {
                    sql += key + ' = ' + message[key] + ' ,';
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
        return this.getMessage(id);
    }
    this.delete = async(id) => {
        var myResult = null;
        var sql = "DELETE FROM message WHERE id = " + id;
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