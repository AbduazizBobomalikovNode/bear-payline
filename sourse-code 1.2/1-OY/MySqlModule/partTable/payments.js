function Payments(db) {
    this.getPayments = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM payments  WHERE id='" + id + "'", function(err, result, fields) {
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
    this.getPaymentsUser = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM payments  WHERE iduser='" + id + "'", function(err, result, fields) {
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
    this.getPaymentsAll = async() => {
        var myResult = null;
        db.query("SELECT * FROM payments ", function(err, result, fields) {
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
    this.addPayments = async(payments) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        var values = "";
        var keys = "";
        var myResult = null;
        for (const key in payments) {
            if (Object.hasOwnProperty.call(payments, key)) {
                values += '"' + payments[key] + '" ,';
                keys += key + ",";
            }
        }

        var sql = 'INSERT INTO payments (' + keys + ') VALUES(' + values + ')';
        sql = sql.replaceAll(',)', ')');
        db.query(sql, function(err, result) {
            if (err) {
                console.log(err.sqlMessage);
                myResult = false;
            } else myResult = result;
        });
        while (myResult == null) {
            await sleep(5);
        }
        return this.getPayments(payments.id);
    }
    this.update = async(id, payments) => {
        var myResult = null;
        var sql = 'UPDATE payments SET ';
        for (const key in payments) {
            if (Object.hasOwnProperty.call(payments, key)) {
                if (typeof payments[key] == 'string') {
                    sql += key + '= "' + payments[key] + '"';
                } else {
                    sql += key + '= ' + payments[key] + ' ';
                }
            }
        }
        sql += 'WHERE id =' + id;
        db.query(sql, function(err, result) {
            if (err) {
                console.log(err.sqlMessage);
                myResult = false;
            } else myResult = result;
        });
        while (myResult == null) {
            await sleep(5);
        }
        return this.getPayments(id);
    }
    this.delete = async(id) => {
        var myResult = null;
        var old = this.getPayments(id);
        var sql = "DELETE FROM payments WHERE id = " + id;
        db.query(sql, function(err, result) {
            if (err) {
                console.log(err.sqlMessage);
                myResult = false;
            } else myResult = result;
        });
        while (myResult == null) {
            await sleep(5);
        }
        return old;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = Payments;
/*
getPayments()
getPaymentsUser()
getPaymentsAll()
addPayments()
update()
delete()
*/