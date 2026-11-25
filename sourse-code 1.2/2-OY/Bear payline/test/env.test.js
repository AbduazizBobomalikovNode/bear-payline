const test = require('node:test');
const assert = require('node:assert/strict');
const { REQUIRED, missingEnv, envProblem } = require('../server/resurs/funtion/env');

const full = () => Object.fromEntries(REQUIRED.map((k) => [k, 'x'.repeat(20)]));

test('envProblem: hammasi bor bo\'lsa null', () => {
    assert.equal(envProblem(full()), null);
});

test('envProblem: yetishmayotgan nomlar Uzbek xabarda, qiymatlarsiz', () => {
    const env = full();
    delete env.JWT_SECRET;
    env.MYSQL_PASSWORD = '   ';
    const msg = envProblem(env);
    assert.match(msg, /yetishmayapti/);
    assert.match(msg, /JWT_SECRET/);
    assert.match(msg, /MYSQL_PASSWORD/);
    assert.doesNotMatch(msg, /xxxx/);
    assert.deepEqual(missingEnv(env).sort(), ['JWT_SECRET', 'MYSQL_PASSWORD']);
});

test('envProblem: qisqa JWT_SECRET rad etiladi', () => {
    const env = full();
    env.JWT_SECRET = 'short';
    assert.match(envProblem(env), /JWT_SECRET/);
});
