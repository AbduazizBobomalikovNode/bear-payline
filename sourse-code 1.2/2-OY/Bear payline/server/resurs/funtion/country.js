// Telefon raqamga mos davlatni topadi (eng uzun mos keladigan phone_code tanlanadi).
// countries - [{ id, phone_code }]. Bitta so'rov bilan olingan ro'yxat ustida ishlaydi.
function matchCountry(phone, countries) {
    if (typeof phone !== 'string' || !Array.isArray(countries)) return null;
    let best = null;
    for (const c of countries) {
        const code = c && typeof c.phone_code === 'string' ? c.phone_code : '';
        if (code && phone.startsWith(code) && (!best || code.length > best.phone_code.length)) {
            best = c;
        }
    }
    return best;
}

// +998901234567 kabi xalqaro format
const PHONE_RE = /^\+[1-9]\d{8,14}$/;
function isValidPhone(phone) {
    return typeof phone === 'string' && PHONE_RE.test(phone);
}

module.exports = { matchCountry, isValidPhone };
