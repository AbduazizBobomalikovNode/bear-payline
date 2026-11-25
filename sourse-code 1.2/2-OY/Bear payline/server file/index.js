const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();

const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use('/images', express.static(UPLOAD_DIR));

const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'];
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

// multer konfiguratsiyasi: tasodifiy fayl nomi, faqat ruxsat etilgan turlar, hajm cheklovi
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, UPLOAD_DIR)
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname || '').toLowerCase();
        cb(null, file.fieldname + '-' + Date.now() + '-' + crypto.randomBytes(6).toString('hex') + (ALLOWED_EXT.includes(ext) ? ext : ''));
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: function(req, file, cb) {
        const ext = path.extname(file.originalname || '').toLowerCase();
        if (ALLOWED_EXT.includes(ext) && ALLOWED_MIME.includes(file.mimetype)) return cb(null, true);
        const err = new Error('Faqat rasm yoki pdf fayl yuborish mumkin');
        err.httpStatusCode = 400;
        return cb(err);
    }
})

app.post('/uploadfile', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Iltimos fayl yuboring')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file);
})

// Faqat uploads papkasidagi faylni o'chiradi: sarlavhadagi yo'lning faqat fayl nomi olinadi (path traversal yo'q).
app.delete('/file', (req, res, next) => {
    const name = path.basename(String(req.headers.filename || ''));
    if (name && name !== '.' && name !== '..') {
        const target = path.join(UPLOAD_DIR, name);
        try {
            fs.unlinkSync(target);
            return res.status(200).json({
                ok: "fayl o'chirildi"
            });
        } catch (error) {
            return res.status(400).json({
                error: "faylni o'chirib bo'lmadi"
            });
        }
    }
    return res.status(400).json({ error: 'fayl nomi yuborilmadi' });
});

app.use((err, req, res, next) => {
    res.status(err.httpStatusCode || (err.name === 'MulterError' ? 400 : 500)).json({ error: err.message });
});

let port = process.env.PORT || 3003;

app.listen(port, () => console.log('Fayl serveri ishga tushdi, port: ' + port));
