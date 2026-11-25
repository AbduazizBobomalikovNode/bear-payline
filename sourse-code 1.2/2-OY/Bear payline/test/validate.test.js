const test = require('node:test');
const assert = require('node:assert/strict');
const user = require('../server/resurs/validate-sxema/user');
const message = require('../server/resurs/validate-sxema/message');
const payments = require('../server/resurs/validate-sxema/payments');
const news = require('../server/resurs/validate-sxema/news');

const okUser = { full_name: 'Demo Foydalanuvchi', phone: '+998000000001', idrole: 1, idcountry: 2 };

test('user: to\'g\'ri ma\'lumot o\'tadi', () => {
    assert.equal(user(okUser, 'add').error, undefined);
});

test('user: add rejimida majburiy maydonlar', () => {
    const { full_name, ...rest } = okUser;
    assert.ok(user(rest, 'add').error);
});

test('user: update rejimida qisman ma\'lumot mumkin', () => {
    assert.equal(user({ address: 'Toshkent' }).error, undefined);
});

test('user: noma\'lum kalit (masalan $where, id) rad etiladi', () => {
    assert.ok(user({ ...okUser, $where: '1' }, 'add').error);
    assert.ok(user({ id: 5 }).error);
});

test('user: obyekt ko\'rinishidagi qiymat (NoSQL in\'ektsiya) rad etiladi', () => {
    assert.ok(user({ ...okUser, phone: { $ne: '' } }, 'add').error);
});

test('message: matn uzunligi 1..2000', () => {
    const m = { to_user: 1, from_user: 2, text: 'salom', is_read: false, date: '2024-01-01', is_reply: false };
    assert.equal(message(m, 'add').error, undefined);
    assert.ok(message({ ...m, text: '' }, 'add').error);
    assert.ok(message({ ...m, text: 'x'.repeat(2001) }, 'add').error);
});

test('payments: summa son bo\'lishi shart', () => {
    const p = {
        iduser: 1, date: '2024-01-01', sender_card_number: '8600000000000001', amout: 1000, currency: 'UZS',
        receiver_card_number: '8600000000000002', receiver_full_name: 'Demo Qabul', commission: 10, method: 'p2p'
    };
    assert.equal(payments(p, 'add').error, undefined);
    assert.ok(payments({ ...p, amout: 'abc' }, 'add').error);
});

test('news: sarlavha kamida 3 belgi', () => {
    assert.ok(news({ title: 'ab', content: 'x' }, 'add').error);
    assert.equal(news({ title: 'Yangilik', content: 'x' }, 'add').error, undefined);
});
