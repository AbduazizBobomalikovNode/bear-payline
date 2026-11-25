const express = require('express');
const crypto = require('crypto');
const Auth = express.Router();
const dbp = require('../SuperDb/main');
const generateId = require('../resurs/funtion/getid');
const createLimiter = require('../resurs/funtion/rateLimit');
const { signToken } = require('../resurs/funtion/token');
const { matchCountry, isValidPhone } = require('../resurs/funtion/country');

const WINDOW = 10 * 60 * 1000;
const CODE_TTL = 10 * 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;

// SMS yuborish endpointi: bitta IP dan 10 daqiqada 10 ta, bitta raqamga 3 ta
const loginIpLimiter = createLimiter({ windowMs: WINDOW, max: 10, keyFn: (req) => req.ip });
const loginPhoneLimiter = createLimiter({ windowMs: WINDOW, max: 3 });
// Kodni tekshirish: IP bo'yicha 30 ta, har bir tasdiqlash id uchun 5 ta urinish
const chekIpLimiter = createLimiter({ windowMs: WINDOW, max: 30, keyFn: (req) => req.ip });
const chekIdLimiter = createLimiter({ windowMs: WINDOW, max: MAX_CODE_ATTEMPTS });

function tooMany(res, r) {
    res.set('Retry-After', String(Math.ceil(r.retryAfterMs / 1000)));
    return res.status(429).json({ error: "Urinishlar juda ko'p. Birozdan keyin qaytadan urinib ko'ring." });
}

Auth.post('/login', loginIpLimiter, async(req, res) => {
    const auth = req.body || {};
    if (!isValidPhone(auth.phone)) {
        return res.status(400).json({ error: "telefon raqam xato!." });
    }
    const limit = loginPhoneLimiter.hit(auth.phone);
    if (!limit.allowed) return tooMany(res, limit);

    const db = await dbp;
    const country = matchCountry(auth.phone, await db.country.getCountryAll());
    if (!country) {
        return res.status(400).json({ error: "telefon raqam xato!." });
    }
    let result = null;
    try {
        result = await sendCode(db, auth.phone);
    } catch (error) {
        return res.status(500).json({ error: "serverda xatolik mavjut  keyinroq urinib ko'ring" });
    }
    if (result) {
        return res.status(200).json({
            status: auth.phone + "telefon raqamga tasdiqlash kodi yuborildi.",
            cheksId: result
        });
    }
    return res.status(400).json({ error: auth.phone + "telefon raqamga  xbar jo'natip bo'lmadi" });
});

Auth.post('/chek', chekIpLimiter, async(req, res) => {
    const body = req.body || {};
    const id = parseInt(body.id, 10);
    if (!id || (typeof body.code !== 'string' && typeof body.code !== 'number')) {
        return res.status(400).json({ error: "tasdiqlashda  xatolikiltimos qaytadan urinib ko'ring!." });
    }
    const attempt = chekIdLimiter.hit(String(id));
    if (!attempt.allowed) {
        return tooMany(res, attempt);
    }
    const db = await dbp;
    const result = await db.cheks.getCheks(id);
    if (!result) {
        return res.status(400).json({ error: "tasdiqlashda  xatolikiltimos qaytadan urinib ko'ring!." });
    }
    if (typeof result.date === 'number' && result.date < Date.now()) {
        await db.cheks.delete(id);
        return res.status(400).json({ error: "tasdiqlash kodi xato!." });
    }
    if (!codesEqual(result.code, body.code)) {
        return res.status(400).json({ error: "tasdiqlash kodi xato!." });
    }
    // Kod bir marta ishlatiladi
    await db.cheks.delete(id);
    chekIdLimiter.forget(String(id));

    const found = await db.user.getUserForObj({ phone: String(result.phone) });
    if (found) {
        const roleUser = await db.role.getRole(found.idrole);
        if (!roleUser) {
            return res.status(500).json({ error: "serverda xatolik mavjut  keyinroq urinib ko'ring." });
        }
        const { idrole, ...rest } = found;
        const token = signToken({...rest, licence: roleUser.licence, role: roleUser.role });
        return res.header('x-web-token', token).status(200).json({ info: 'hisobga kirish mufaqiyatli.' });
    }

    const country = matchCountry(result.phone, await db.country.getCountryAll());
    const idRole = await db.role.getRoleForObj({ role: "user" });
    if (!country || !idRole) {
        return res.status(500).json({ error: "serverda xatolik mavjut  keyinroq urinib ko'ring." });
    }
    let user = {
        id: generateId(),
        full_name: "unknown name",
        phone: result.phone,
        idcountry: country.id,
        idrole: idRole.id,
        email_status: 0,
        status: -1
    };
    const payload = {
        id: user.id,
        full_name: user.full_name,
        phone: user.phone,
        idcountry: user.idcountry,
        email_status: user.email_status,
        status: user.status
    };
    const resultUser = await db.user.addUser(user);
    if (resultUser.error) {
        return res.status(500).json({ error: "serverda xatolik mavjut  keyinroq urinib ko'ring." });
    }
    const token = signToken({...payload, licence: idRole.licence, role: idRole.role });
    return res.header('x-web-token', token).status(200).json({ info: 'hisobga kirish mufaqiyatli.' });
});
module.exports = Auth;

function codesEqual(stored, given) {
    const a = Buffer.from(String(stored));
    const b = Buffer.from(String(given));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function sendCode(db, phone) {
    let cheks = {
        id: generateId(),
        phone: phone,
        code: String(crypto.randomInt(100000, 1000000)),
        date: (new Date()).valueOf() + CODE_TTL
    };
    const sent = await sendSMSCode(phone.slice(1), cheks.code);
    if (!sent) return null;
    const result = await db.cheks.addCheks(cheks);
    if (result.error) {
        throw new Error("tasdiqlash kodini saqlab bo'lmadi");
    }
    return cheks.id;
}

// ---- SMS provayder (SMS_URL, SMS_LOGIN, SMS_PASSWORD muhit o'zgaruvchilari) ----
let smsToken = null;
let smsTokenAt = 0;
const SMS_TOKEN_TTL = 30 * 60 * 1000;

async function postLogin(force) {
    if (!force && smsToken && Date.now() - smsTokenAt < SMS_TOKEN_TTL) return smsToken;
    try {
        const response = await fetch(process.env.SMS_URL + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: process.env.SMS_LOGIN,
                password: process.env.SMS_PASSWORD
            }),
            signal: AbortSignal.timeout(10000)
        });
        const result = await response.json();
        smsToken = result.data.token;
        smsTokenAt = Date.now();
        return smsToken;
    } catch (error) {
        console.error('SMS provayderiga kirishda xatolik:', error.message);
        return null;
    }
}

async function sendSMSCode(phone, code, retry = true) {
    try {
        const token = await postLogin(false);
        if (!token) return null;
        const response = await fetch(process.env.SMS_URL + '/message/sms/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                mobile_phone: phone,
                message: 'salom sizning tasdiqlash kodingiz ' + code,
                from: process.env.SMS_FROM || '4546'
            }),
            signal: AbortSignal.timeout(10000)
        });
        if (response.status === 401 && retry) {
            await postLogin(true);
            return sendSMSCode(phone, code, false);
        }
        if (!response.ok) return null;
        const result = await response.json();
        return result.data || true;
    } catch (error) {
        console.error('SMS yuborishda xatolik:', error.message);
        return null;
    }
}
