const test = require('node:test');
const assert = require('node:assert/strict');
const mysql = require('mysql');
const sql = require('../server/SuperDb/MySqlModule/sql');

test('buildSelect: qiymat parametr bo\'lib qoladi, SQL matniga qo\'shilmaydi', () => {
    const evil = "1' OR '1'='1";
    const q = sql.buildSelect('user', 'id', evil);
    assert.equal(q.sql, 'SELECT * FROM ?? WHERE ?? = ?');
    assert.deepEqual(q.params, ['user', 'id', evil]);
    const final = mysql.format(q.sql, q.params);
    assert.equal(final, "SELECT * FROM `user` WHERE `id` = '1\\' OR \\'1\\'=\\'1'");
});

test('buildSelect: noto\'g\'ri ustun nomi rad etiladi', () => {
    assert.throws(() => sql.buildSelect('user', 'id; DROP TABLE user', 1));
});

test('cleanRow: noto\'g\'ri kalitlar tashlanadi, obyektlar JSON bo\'ladi', () => {
    const row = sql.cleanRow({ name: 'a', 'x`; DROP': 1, 'a b': 2, und: undefined, meta: { k: 1 }, n: null });
    assert.deepEqual(row, { name: 'a', meta: '{"k":1}', n: null });
});

test('buildInsert / buildUpdate: ?? va ? o\'rinbosarlar', () => {
    const i = sql.buildInsert('user', { id: 1, full_name: "O'Brien" });
    assert.equal(i.sql, 'INSERT INTO ?? SET ?');
    assert.match(mysql.format(i.sql, i.params), /full_name` = 'O\\'Brien'/);
    const u = sql.buildUpdate('user', 5, { address: 'x' });
    assert.equal(u.sql, 'UPDATE ?? SET ? WHERE id = ?');
    assert.deepEqual(u.params[2], 5);
    assert.equal(sql.buildUpdate('user', 5, { '$bad': 1 }).empty, true);
});

test('makeTable: soxta ulanish bilan parametrlar uzatiladi', async() => {
    const calls = [];
    const con = { query(s, p, cb) { calls.push([s, p]); cb(null, [{ id: 7 }]); } };
    const t = sql.makeTable(con, 'user');
    assert.deepEqual(await t.one('id', "7' OR 1=1"), { id: 7 });
    assert.deepEqual(calls[0], ['SELECT * FROM ?? WHERE ?? = ?', ['user', 'id', "7' OR 1=1"]]);
    const failing = sql.makeTable({ query(s, p, cb) { cb({ sqlMessage: 'xato' }); } }, 'user');
    assert.deepEqual(await failing.insert({ id: 1 }), { error: { message: 'xato' } });
    assert.equal(await failing.one('id', 1), false);
});
