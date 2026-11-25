// Muhit o'zgaruvchilarini tekshirish (sof funksiya, testlash oson).
const REQUIRED = [
    'JWT_SECRET',
    'MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE',
    'MONGO_URI',
    'SMS_LOGIN', 'SMS_PASSWORD', 'SMS_URL'
];

function missingEnv(env, names = REQUIRED) {
    return names.filter((n) => typeof env[n] !== 'string' || env[n].trim() === '');
}

// Xatolik matnini qaytaradi (hammasi joyida bo'lsa null). Qiymatlar hech qachon chiqarilmaydi.
function envProblem(env, names = REQUIRED) {
    const missing = missingEnv(env, names);
    if (missing.length) {
        return "Muhit o'zgaruvchilari yetishmayapti: " + missing.join(', ') +
            ". .env.example faylini .env ga nusxalab, qiymatlarni to'ldiring.";
    }
    if (env.JWT_SECRET && env.JWT_SECRET.length < 16) {
        return "JWT_SECRET juda qisqa (kamida 16 belgi bo'lishi kerak).";
    }
    return null;
}

module.exports = { REQUIRED, missingEnv, envProblem };
