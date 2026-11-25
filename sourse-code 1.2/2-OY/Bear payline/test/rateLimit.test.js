const test = require('node:test');
const assert = require('node:assert/strict');
const createLimiter = require('../server/resurs/funtion/rateLimit');

test('hit: max dan keyin rad etadi, oyna tugagach tiklanadi', () => {
    const l = createLimiter({ windowMs: 1000, max: 3 });
    const t0 = 1_000_000;
    assert.equal(l.hit('a', t0).allowed, true);
    assert.equal(l.hit('a', t0 + 1).allowed, true);
    const third = l.hit('a', t0 + 2);
    assert.equal(third.allowed, true);
    assert.equal(third.remaining, 0);
    const fourth = l.hit('a', t0 + 3);
    assert.equal(fourth.allowed, false);
    assert.ok(fourth.retryAfterMs > 0 && fourth.retryAfterMs <= 1000);
    assert.equal(l.hit('a', t0 + 1001).allowed, true);
});

test('hit: kalitlar mustaqil', () => {
    const l = createLimiter({ windowMs: 1000, max: 1 });
    assert.equal(l.hit('a', 5).allowed, true);
    assert.equal(l.hit('b', 5).allowed, true);
    assert.equal(l.hit('a', 6).allowed, false);
});

test('sweep va forget xotirani tozalaydi', () => {
    const l = createLimiter({ windowMs: 100, max: 1 });
    l.hit('a', 0); l.hit('b', 0);
    assert.equal(l.size(), 2);
    l.forget('a');
    assert.equal(l.size(), 1);
    l.sweep(1000);
    assert.equal(l.size(), 0);
});

test('middleware: 429 va Retry-After', () => {
    const l = createLimiter({ windowMs: 60000, max: 1, keyFn: () => 'k' });
    const res = { headers: {}, set(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
    let nexted = 0;
    l({}, res, () => nexted++);
    l({}, res, () => nexted++);
    assert.equal(nexted, 1);
    assert.equal(res.code, 429);
    assert.ok(Number(res.headers['Retry-After']) >= 1);
});
