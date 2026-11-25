const test = require('node:test');
const assert = require('node:assert/strict');
const { parseLicence, isAllowed } = require('../server/resurs/funtion/licence');

test('isAllowed: JSON matn va obyekt', () => {
    const lic = '{"card":["get","add"],"news":["get"]}';
    assert.equal(isAllowed(lic, 'card', 'add'), true);
    assert.equal(isAllowed(lic, 'card', 'delete'), false);
    assert.equal(isAllowed(JSON.parse(lic), 'news', 'get'), true);
    assert.equal(isAllowed(lic, 'payments', 'get'), false);
});

test('isAllowed: * hamma narsaga', () => {
    assert.equal(isAllowed('{"*":["*"]}', 'role', 'delete'), true);
    assert.equal(isAllowed('{"card":["*"]}', 'card', 'delete'), true);
    assert.equal(isAllowed('{"card":["*"]}', 'role', 'delete'), false);
});

test('isAllowed: tushunarsiz format - ruxsat yo\'q', () => {
    for (const bad of ['', 'admin', null, undefined, 5, '[1]', '{bad']) {
        assert.equal(isAllowed(bad, 'card', 'get'), false);
    }
    assert.deepEqual(parseLicence('{bad'), {});
});

test('isAllowed: prototip kalitlari (constructor) ruxsat bermaydi', () => {
    assert.equal(isAllowed('{}', 'constructor', 'get'), false);
    assert.equal(isAllowed('{}', '__proto__', 'get'), false);
});
