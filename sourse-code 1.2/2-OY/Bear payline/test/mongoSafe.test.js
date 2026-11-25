const test = require('node:test');
const assert = require('node:assert/strict');
const { toNum, safeDoc, safeFilter } = require('../server/SuperDb/MongoDbModule/safe');

test('toNum: sonlar o\'tadi, obyekt/operator NaN', () => {
    assert.equal(toNum(5), 5);
    assert.equal(toNum('42'), 42);
    assert.ok(Number.isNaN(toNum({ $gt: '' })));
    assert.ok(Number.isNaN(toNum('')));
    assert.ok(Number.isNaN(toNum('1; drop')));
    assert.ok(Number.isNaN(toNum(null)));
});

test('safeDoc: $ va . kalitlari chuqur olib tashlanadi', () => {
    const out = safeDoc({ a: 1, $set: { x: 1 }, 'b.c': 2, n: { $ne: 1, ok: 2 }, arr: [{ $x: 1, y: 2 }] });
    assert.deepEqual(out, { a: 1, n: { ok: 2 }, arr: [{ y: 2 }] });
});

test('safeFilter: faqat primitiv qiymatlar', () => {
    assert.deepEqual(safeFilter({ phone: '+998000000001' }), { phone: '+998000000001' });
    assert.throws(() => safeFilter({ phone: { $ne: '' } }), TypeError);
    assert.throws(() => safeFilter({ $where: '1' }), TypeError);
    assert.throws(() => safeFilter({ 'a.b': 1 }), TypeError);
});
