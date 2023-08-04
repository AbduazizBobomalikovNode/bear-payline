function Card(db) {
    this.getCard = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM card  WHERE id='" + id + "'", function(err, result, fields) {
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
    this.getCardAll = async() => {
        var myResult = null;
        db.query("SELECT * FROM card ", function(err, result, fields) {
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
    this.addCard = async(card) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        var values = "";
        var keys = "";
        var myResult = null;
        for (const key in card) {
            if (Object.hasOwnProperty.call(card, key)) {
                values += '"' + card[key] + '" ,';
                keys += key + ",";
            }
        }

        var sql = 'INSERT INTO card (' + keys + ') VALUES(' + values + ')';
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
        var sql = 'UPDATE card SET ';
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
        return this.getCard(id);
    }
    this.delete = async(id) => {
        var myResult = null;
        var sql = "DELETE FROM card WHERE id = " + id;
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
module.exports = Card;
/*
getCard()
getCardAll()
addCard()
update()
delete()
*/