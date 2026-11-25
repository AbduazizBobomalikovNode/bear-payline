const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
process.env.JWT_SECRET = 'test-secret-test-secret-123456';
const { signToken, verifyToken } = require('../server/resurs/funtion/token');

test('signToken/verifyToken: aylanma yo\'l, exp qo\'yiladi', () => {
    const t = signToken({ id: 1, role: 'user', exp: 1 });
    const p = verifyToken(t);
    assert.equal(p.id, 1);
    assert.ok(p.exp > Math.floor(Date.now() / 1000), 'payloaddagi exp e\'tiborga olinmaydi');
});

test('verifyToken: alg=none token rad etiladi', () => {
    const none = jwt.sign({ id: 1 }, '', { algorithm: 'none' });
    assert.throws(() => verifyToken(none));
});

test('verifyToken: boshqa algoritm (HS512) rad etiladi', () => {
    const t = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { algorithm: 'HS512' });
    assert.throws(() => verifyToken(t), /invalid algorithm/);
});

test('verifyToken: muddati tugagan token', () => {
    const t = signToken({ id: 1 }, -10);
    assert.throws(() => verifyToken(t), (e) => e.name === 'TokenExpiredError');
});

test('verifyToken: noto\'g\'ri imzo', () => {
    const t = jwt.sign({ id: 1 }, 'boshqa-kalit-boshqa-kalit', { algorithm: 'HS256' });
    assert.throws(() => verifyToken(t));
});
