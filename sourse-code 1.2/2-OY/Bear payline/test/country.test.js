const test = require('node:test');
const assert = require('node:assert/strict');
const { matchCountry, isValidPhone } = require('../server/resurs/funtion/country');

const countries = [
    { id: 1, phone_code: '+7' },
    { id: 2, phone_code: '+998' },
    { id: 3, phone_code: '+99' },
    { id: 4, phone_code: '' },
];

test('matchCountry: eng uzun mos kod tanlanadi', () => {
    assert.equal(matchCountry('+998000000001', countries).id, 2);
    assert.equal(matchCountry('+7999000000', countries).id, 1);
});

test('matchCountry: mos kelmasa yoki noto\'g\'ri kirish bo\'lsa null', () => {
    assert.equal(matchCountry('+1000000000', countries), null);
    assert.equal(matchCountry(null, countries), null);
    assert.equal(matchCountry('+998', null), null);
});

test('isValidPhone', () => {
    assert.equal(isValidPhone('+998000000001'), true);
    for (const bad of ['998000000001', '+0123456789', '+99800', '+998abc000001', { $ne: 1 }, '+998000000001; DROP']) {
        assert.equal(isValidPhone(bad), false);
    }
});
