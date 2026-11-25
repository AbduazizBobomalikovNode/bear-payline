const test = require('node:test');
const assert = require('node:assert/strict');
const formatDate = require('../server/resurs/funtion/formatDate');

test('formatDate: YYYY-MM-DD HH:mm:ss formatida, nol bilan to\'ldiriladi', () => {
    assert.equal(formatDate(new Date(2023, 0, 5, 3, 4, 9)), '2023-01-05 03:04:09');
    assert.equal(formatDate(new Date(2024, 11, 31, 23, 59, 59)), '2024-12-31 23:59:59');
});

test('formatDate: kabisa yili 29-fevral', () => {
    assert.equal(formatDate(new Date(2024, 1, 29, 12, 0, 0)), '2024-02-29 12:00:00');
});
