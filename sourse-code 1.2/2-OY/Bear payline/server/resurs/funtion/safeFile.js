const path = require('path');

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'];
const MAX_FILE_BYTES = 5 * 1024 * 1024;

// Foydalanuvchi bergan fayl nomidan xavfsiz nom yasaydi (yo'l ajratgichlar, g'alati belgilar olib tashlanadi).
function safeFileName(name) {
    const base = path.basename(String(name || '').replace(/\\/g, '/'));
    const ext = path.extname(base).toLowerCase();
    const stem = base.slice(0, base.length - ext.length).replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 60) || 'file';
    return stem + (ALLOWED_EXT.includes(ext) ? ext : '');
}

function isAllowedUpload(mimetype, originalname) {
    const ext = path.extname(String(originalname || '')).toLowerCase();
    return ALLOWED_MIME.includes(mimetype) && ALLOWED_EXT.includes(ext);
}

// multer uchun fileFilter
function fileFilter(req, file, cb) {
    if (isAllowedUpload(file.mimetype, file.originalname)) return cb(null, true);
    const err = new Error("Faqat rasm (jpg, png, webp, gif) yoki pdf fayl yuborish mumkin.");
    err.status = 400;
    return cb(err);
}

// Fayl serverida o'chiriladigan fayl uchun faqat nomning o'zi (yo'lsiz).
function remoteFileName(imgUrl, baseUrl) {
    const rest = String(imgUrl || '').replace(String(baseUrl || '') + '/images/', '');
    return path.basename(rest);
}

module.exports = { ALLOWED_MIME, ALLOWED_EXT, MAX_FILE_BYTES, safeFileName, isAllowedUpload, fileFilter, remoteFileName };
