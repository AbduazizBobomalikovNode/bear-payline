// Fayl serveri bilan ishlash: xavfsiz yuklash (multer) va fayl serveriga uzatish.
// Fayl serveri manzili FAQAT muhit o'zgaruvchisidan (HOST_FILE_SERVER) olinadi,
// so'rov tanasidagi hech qanday URL ga so'rov yuborilmaydi (SSRF yo'q).
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const axios = require('axios').default;
const FormData = require('form-data');
const { fileFilter, MAX_FILE_BYTES, safeFileName, remoteFileName } = require('./safeFile');

const UPLOAD_DIR = path.join(__dirname, '..', '..', '..', 'resurs', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    // Foydalanuvchi bergan nom diskka yozilmaydi: tasodifiy nom + ruxsat etilgan kengaytma
    filename: (req, file, cb) => {
        const ext = path.extname(safeFileName(file.originalname));
        cb(null, crypto.randomBytes(16).toString('hex') + ext);
    }
});

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_BYTES, files: 1, fields: 20 } });

function baseUrl() {
    const raw = process.env.HOST_FILE_SERVER;
    let u;
    try {
        u = new URL(raw);
    } catch (e) {
        const err = new Error('Fayl serveri sozlanmagan (HOST_FILE_SERVER).');
        err.status = 503;
        throw err;
    }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
        const err = new Error("HOST_FILE_SERVER faqat http(s) bo'lishi kerak.");
        err.status = 503;
        throw err;
    }
    return u.origin + u.pathname.replace(/\/+$/, '');
}

function discard(file) {
    if (!file || !file.path) return;
    try { fs.unlinkSync(file.path); } catch (e) { /* allaqachon o'chirilgan */ }
}

// Faylni fayl serveriga yuboradi, ommaviy URL qaytaradi. Mahalliy nusxa doim o'chiriladi.
async function sendFile(file) {
    const base = baseUrl();
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(file.path), {
            filename: safeFileName(file.originalname),
            contentType: file.mimetype,
        });
        const response = await axios.post(base + '/uploadfile', form, {
            headers: { ...form.getHeaders() },
            timeout: 20000,
            maxRedirects: 0,
            maxBodyLength: MAX_FILE_BYTES * 2,
        });
        return base + '/images/' + path.basename(String(response.data.filename));
    } finally {
        discard(file);
    }
}

// Fayl serveridan faylni o'chiradi (faqat fayl nomi uzatiladi, yo'l emas).
async function removeRemote(imgUrl) {
    const base = baseUrl();
    const name = remoteFileName(imgUrl, base);
    if (!name || name === '.' || name === '..') return;
    await axios.delete(base + '/file', {
        headers: { 'Content-Type': 'application/json', filename: './uploads/' + name },
        timeout: 20000,
        maxRedirects: 0,
    });
}

module.exports = { upload, sendFile, removeRemote, discard, UPLOAD_DIR };
