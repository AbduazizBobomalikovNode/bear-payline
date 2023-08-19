function News(db) {
    this.getNews = async(id) => {
        var myResult = null;
        db.query("SELECT * FROM news WHERE id='" + id + "'", function(err, result, fields) {
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
    this.getNewsAll = async() => {
        var myResult = null;
        db.query("SELECT * FROM news", function(err, result, fields) {
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
    this.addNews = async(news) => { //id, full_name, phone, address, email, status, email_status, idcountry, idrole
        var values = "";
        var keys = "";
        var myResult = null;
        for (const key in news) {
            if (Object.hasOwnProperty.call(news, key)) {
                values += '"' + news[key] + '" ,';
                keys += key + ",";
            }
        }

        var sql = 'INSERT INTO news (' + keys + ') VALUES(' + values + ')';
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
    this.update = async(id, news) => {
        var myResult = null;

        var sql = 'UPDATE news SET ';
        for (const key in news) {
            if (Object.hasOwnProperty.call(news, key)) {
                if (typeof news[key] == 'string') {
                    sql += key + '= "' + news[key] + '"';
                } else {
                    sql += key + '= ' + news[key] + ' ';
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
        return this.getNews(id);
    }
    this.delete = async(id) => {
        var myResult = null;
        var sql = "DELETE FROM news WHERE id = " + id;
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
module.exports = News;
/*
getNews()
getNewsAll()
addNews()
update()
delete()
*/