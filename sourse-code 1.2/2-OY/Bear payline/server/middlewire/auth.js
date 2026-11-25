const { verifyToken } = require('../resurs/funtion/token');
const { isAllowed } = require('../resurs/funtion/licence');
const { isAdmin } = require('../resurs/funtion/access');
const createLimiter = require('../resurs/funtion/rateLimit');

// Har bir foydalanuvchiga 1 sekundda 100 ta so'rov (avvalgi `limit` mantig'i, lekin serverda saqlanadi).
const userLimiter = createLimiter({
    windowMs: 1000,
    max: 100,
    keyFn: (req) => (req.user ? 'u' + req.user.id : req.ip),
    message: "So'rovlar ko'p so'ldi. 1 sekuntdan keyin qaytatdan urinib ko'ring."
});

function readToken(req) {
    const h = req.header('x-web-token');
    if (h) return h;
    const a = req.header('authorization');
    if (a && /^Bearer\s+/i.test(a)) return a.replace(/^Bearer\s+/i, '');
    return null;
}

// Tokenni tekshiradi va req.user ni o'rnatadi (litsenziyani tekshirmaydi).
function authenticate(req, res, next) {
    const token = readToken(req);
    if (!token) {
        return res.status(401).json({ error: "Avtorizatsiyadan o'tilmagan, token yuborilmagan." });
    }
    try {
        req.user = verifyToken(token);
    } catch (err) {
        if (err && err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token muddati tugagan, qaytadan kiring.' });
        }
        return res.status(401).json({ error: "Token noto'g'ri." });
    }
    return userLimiter(req, res, next);
}

// Token + litsenziya: /api/<resurs>/<amal>/... yo'li bo'yicha.
function authorize(req, res, next) {
    return authenticate(req, res, (err) => {
        if (err) return next(err);
        const parts = req.originalUrl.split('?')[0].split('/');
        const resource = parts[2];
        const action = parts[3];
        if (!isAllowed(req.user.licence, resource, action)) {
            return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
        }
        return next();
    });
}

function requireAdmin(req, res, next) {
    if (!isAdmin(req.user)) {
        return res.status(403).json({ error: "Faqat administrator uchun." });
    }
    return next();
}

module.exports = authorize;
module.exports.authenticate = authenticate;
module.exports.requireAdmin = requireAdmin;
module.exports.readToken = readToken;
