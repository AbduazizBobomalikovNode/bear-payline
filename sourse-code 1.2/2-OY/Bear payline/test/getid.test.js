const test = require('node:test');
const assert = require('node:assert/strict');
const getid = require('../server/resurs/funtion/getid');

test('getid(): 8 xonali butun son', () => {
    for (let i = 0; i < 200; i++) {
        const id = getid();
        assert.ok(Number.isInteger(id));
        assert.equal(String(id).length, 8);
    }
});

test('getid(n): n xonali son (SMS kodi uchun)', () => {
    for (const n of [4, 5, 6]) {
        for (let i = 0; i < 100; i++) assert.equal(String(getid(n)).length, n);
    }
});

test('getid(): takrorlanish juda kam', () => {
    const set = new Set();
    for (let i = 0; i < 1000; i++) set.add(getid());
    assert.ok(set.size > 990);
});
