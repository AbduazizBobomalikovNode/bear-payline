function Card_has_user(db) {
    this.getCardHasUser = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM card_has_user  WHERE id='" + id + "'", function(err, result, fields) {
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
    this.getCardHasUserForCard = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM card_has_user  WHERE idcard='" + id + "'", function(err, result, fields) {
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
    this.getCardHasUserForUser = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM card_has_user  WHERE iduser='" + id + "'", function(err, result, fields) {
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
    this.getCardHasUserAll = async() => {
        var myResult = null;
        db.query("SELECT * FROM card_has_user ", function(err, result, fields) {
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
    this.addCardHasUser = async(card) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        var values = "";
        var keys = "";
        var myResult = null;
        for (const key in card) {
            if (Object.hasOwnProperty.call(card, key)) {
                values += '"' + card[key] + '" ,';
                keys += key + ",";
            }
        }

        var sql = 'INSERT INTO card_has_user (' + keys + ') VALUES(' + values + ')';
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
    this.update = async(id, card) => {
        var myResult = null;
        var sql = 'UPDATE card_has_user SET ';
        for (const key in card) {
            if (Object.hasOwnProperty.call(card, key)) {
                if (typeof card[key] == 'string') {
                    sql += key + '= "' + card[key] + '"';
                } else {
                    sql += key + '= ' + card[key] + ' ';
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
        return this.getCardHasUser(id);
    }
    this.delete = async(id) => {
        var myResult = null;
        var sql = "DELETE FROM card_has_user WHERE id = " + id;
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
module.exports = Card_has_user;
/*
getCardHasUser()
getCardHasUserForCard()
getCardHasUserForUser()
getCardHasUserAll()
addCardHasUser()
update()
delete()
*/