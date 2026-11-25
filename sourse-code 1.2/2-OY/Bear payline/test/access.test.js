const test = require('node:test');
const assert = require('node:assert/strict');
const { isAdmin, canAccessUser } = require('../server/resurs/funtion/access');

test('isAdmin', () => {
    assert.equal(isAdmin({ role: 'admin' }), true);
    assert.equal(isAdmin({ role: 'user' }), false);
    assert.equal(isAdmin(null), false);
});

test('canAccessUser: admin hammaga, foydalanuvchi faqat o\'ziga', () => {
    assert.equal(canAccessUser({ role: 'admin', id: 1 }, 99), true);
    assert.equal(canAccessUser({ role: 'user', id: 5 }, '5'), true);
    assert.equal(canAccessUser({ role: 'user', id: 5 }, 6), false);
    assert.equal(canAccessUser({ role: 'user', id: 5 }, undefined), false);
    assert.equal(canAccessUser(undefined, 1), false);
});
