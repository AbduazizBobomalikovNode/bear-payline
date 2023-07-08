// Document
function Document(db) {
    this.getDocument = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM document  WHERE id='" + id + "'", function(err, result, fields) {
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
    this.getDocumentUser = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM document  WHERE iduser='" + id + "'", function(err, result, fields) {
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
    this.getDocumentAll = async() => {
        var myResult = null;
        db.query("SELECT * FROM document ", function(err, result, fields) {
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
    this.addDocument = async(document) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        var values = "";
        var keys = "";
        var myResult = null;
        for (const key in document) {
            if (Object.hasOwnProperty.call(document, key)) {
                values += '"' + document[key] + '" ,';
                keys += key + ",";
            }
        }

        var sql = 'INSERT INTO document (' + keys + ') VALUES(' + values + ')';
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
        return this.getDocument(document.id);
    }
    this.update = async(id, document) => {
        var myResult = null;
        var sql = 'UPDATE document SET ';
        for (const key in document) {
            if (Object.hasOwnProperty.call(document, key)) {
                if (typeof document[key] == 'string') {
                    sql += key + '= "' + document[key] + '"';
                } else {
                    sql += key + '= ' + document[key] + ' ';
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
        return this.getDocument(id);
    }
    this.delete = async(id) => {
        var myResult = null;
        var old = this.getDocument(id);
        var sql = "DELETE FROM document WHERE id = " + id;
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
module.exports = Document;
/*
getDocument()
getDocumentUser()
getDocumentAll()
addDocument()
update()
delete()
*/