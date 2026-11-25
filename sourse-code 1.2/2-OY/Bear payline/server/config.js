// .env faylini yuklaydi va majburiy sozlamalarni tekshiradi.
// Biror narsa yetishmasa, jarayon aniq xabar bilan darhol to'xtaydi.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { envProblem } = require('./resurs/funtion/env');

const problem = envProblem(process.env);
if (problem) {
    console.error('Sozlama xatosi: ' + problem);
    process.exit(1);
}

module.exports = {
    port: parseInt(process.env.PORT, 10) || 3000,
    isProduction: process.env.NODE_ENV === 'production',
    corsOrigins: (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
    fileServer: process.env.HOST_FILE_SERVER || ''
};
