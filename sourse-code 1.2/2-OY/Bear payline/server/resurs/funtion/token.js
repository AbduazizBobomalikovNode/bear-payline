const jwt = require('jsonwebtoken');

const ALGORITHM = 'HS256';
const DEFAULT_TTL_SECONDS = 7 * 24 * 60 * 60;

function secret() {
    const s = process.env.JWT_SECRET;
    if (!s) throw new Error('JWT_SECRET sozlanmagan');
    return s;
}

// payload ichidagi exp/iat e'tiborga olinmaydi, muddat expiresIn orqali qo'yiladi.
function signToken(payload, ttlSeconds = DEFAULT_TTL_SECONDS) {
    const { exp, iat, ...rest } = payload;
    return jwt.sign(rest, secret(), { algorithm: ALGORITHM, expiresIn: ttlSeconds });
}

// Algoritm qat'iy HS256, muddati o'tgan token xato beradi.
function verifyToken(token) {
    return jwt.verify(token, secret(), { algorithms: [ALGORITHM] });
}

module.exports = { signToken, verifyToken, ALGORITHM, DEFAULT_TTL_SECONDS };
