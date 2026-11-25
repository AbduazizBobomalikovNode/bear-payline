const test = require('node:test');
const assert = require('node:assert/strict');
process.env.JWT_SECRET = 'test-secret-test-secret-123456';
const { signToken } = require('../server/resurs/funtion/token');
const auth = require('../server/middlewire/auth');

function run(mw, { headers = {}, url = '/api/card/get/all' } = {}) {
    return new Promise((resolve) => {
        const req = { ip: '127.0.0.1', originalUrl: url, header: (n) => headers[n.toLowerCase()] };
        const res = { code: null, status(c) { this.code = c; return this; }, json(b) { this.body = b; resolve({ code: this.code, body: b, req }); return this; }, set() {} };
        mw(req, res, () => resolve({ code: 200, req }));
    });
}

test('auth: tokensiz so\'rov 401', async() => {
    assert.equal((await run(auth)).code, 401);
});

test('auth: noto\'g\'ri token 401', async() => {
    assert.equal((await run(auth, { headers: { 'x-web-token': 'abc.def.ghi' } })).code, 401);
});

test('auth: litsenziya bor bo\'lsa o\'tadi, yo\'q bo\'lsa 403', async() => {
    const token = signToken({ id: 1, role: 'user', licence: '{"card":["get"]}' });
    const ok = await run(auth, { headers: { 'x-web-token': token } });
    assert.equal(ok.code, 200);
    assert.equal(ok.req.user.id, 1);
    assert.equal((await run(auth, { headers: { 'x-web-token': token }, url: '/api/card/delete/5' })).code, 403);
    assert.equal((await run(auth, { headers: { 'x-web-token': token }, url: '/api/role/get/all' })).code, 403);
});

test('auth: Authorization Bearer ham qabul qilinadi', async() => {
    const token = signToken({ id: 2, role: 'admin', licence: '{"*":["*"]}' });
    assert.equal((await run(auth, { headers: { authorization: 'Bearer ' + token } })).code, 200);
});

test('requireAdmin', async() => {
    const adminTok = signToken({ id: 1, role: 'admin', licence: '{"*":["*"]}' });
    const userTok = signToken({ id: 2, role: 'user', licence: '{"*":["*"]}' });
    const chain = (token) => run((req, res, next) => auth.authenticate(req, res, (e) => auth.requireAdmin(req, res, next)), { headers: { 'x-web-token': token } });
    assert.equal((await chain(adminTok)).code, 200);
    assert.equal((await chain(userTok)).code, 403);
});
