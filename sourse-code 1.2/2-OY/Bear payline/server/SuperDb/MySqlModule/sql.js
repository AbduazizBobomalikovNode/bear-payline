// MySQL uchun parametrlangan so'rovlar yordamchisi.
// Qiymatlar doim `?` o'rniga, jadval/ustun nomlari esa `??` orqali (escapeId) uzatiladi,
// shuning uchun SQL in'ektsiya mumkin emas. Polling/sleep o'rniga haqiqiy Promise ishlatiladi.

const IDENT_RE = /^[A-Za-z_Ѐ-ӿ][A-Za-z0-9_Ѐ-ӿ]*$/;

function isIdent(name) {
    return typeof name === 'string' && name.length <= 64 && IDENT_RE.test(name);
}

function query(con, sql, params) {
    return new Promise((resolve, reject) => {
        con.query(sql, params || [], (err, result) => (err ? reject(err) : resolve(result)));
    });
}

// Obyektni qatorga aylantiradi: noto'g'ri nomli kalitlar tashlanadi, ichma-ich obyektlar JSON bo'ladi.
function cleanRow(obj) {
    const row = {};
    if (!obj || typeof obj !== 'object') return row;
    for (const key of Object.keys(obj)) {
        if (!isIdent(key)) continue;
        const v = obj[key];
        if (v === undefined) continue;
        row[key] = (v !== null && typeof v === 'object' && !(v instanceof Date)) ? JSON.stringify(v) : v;
    }
    return row;
}

function errorObject(err) {
    return { error: { message: (err && (err.sqlMessage || err.message)) || 'Noma\'lum xatolik' } };
}

// { sql, params } - testlash uchun sof funksiyalar
function buildInsert(table, obj) {
    const row = cleanRow(obj);
    return { sql: 'INSERT INTO ?? SET ?', params: [table, row], empty: Object.keys(row).length === 0 };
}
function buildUpdate(table, id, obj) {
    const row = cleanRow(obj);
    return { sql: 'UPDATE ?? SET ? WHERE id = ?', params: [table, row, id], empty: Object.keys(row).length === 0 };
}
function buildSelect(table, column, value) {
    if (!isIdent(column)) throw new Error('Noto\'g\'ri ustun nomi');
    return { sql: 'SELECT * FROM ?? WHERE ?? = ?', params: [table, column, value] };
}

function makeTable(con, table) {
    return {
        // bitta qator yoki undefined; xatoda false (avvalgi xatti-harakat)
        async one(column, value) {
            try {
                const q = buildSelect(table, column, value);
                const rows = await query(con, q.sql, q.params);
                return rows[0];
            } catch (err) {
                console.error(table + ': ' + (err.sqlMessage || err.message));
                return false;
            }
        },
        async many(column, value) {
            try {
                const q = buildSelect(table, column, value);
                return await query(con, q.sql, q.params);
            } catch (err) {
                console.error(table + ': ' + (err.sqlMessage || err.message));
                return false;
            }
        },
        async all() {
            try {
                return await query(con, 'SELECT * FROM ??', [table]);
            } catch (err) {
                console.error(table + ': ' + (err.sqlMessage || err.message));
                return false;
            }
        },
        async insert(obj) {
            const q = buildInsert(table, obj);
            if (q.empty) return { error: { message: "Bo'sh ma'lumot" } };
            try {
                return await query(con, q.sql, q.params);
            } catch (err) {
                return errorObject(err);
            }
        },
        // muvaffaqiyatda yangilangan qatorni qaytaradi, xatoda { error }
        async update(id, obj) {
            const q = buildUpdate(table, id, obj);
            if (!q.empty) {
                try {
                    await query(con, q.sql, q.params);
                } catch (err) {
                    return errorObject(err);
                }
            }
            return this.one('id', id);
        },
        async remove(id) {
            try {
                return await query(con, 'DELETE FROM ?? WHERE id = ?', [table, id]);
            } catch (err) {
                return errorObject(err);
            }
        }
    };
}

module.exports = { isIdent, query, cleanRow, errorObject, buildInsert, buildUpdate, buildSelect, makeTable };
