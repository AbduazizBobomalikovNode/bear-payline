const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use('/images', express.static('uploads'));
// multer konfiguratsiyasi
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.slice(file.originalname.lastIndexOf('.') + 1))
    }
})

const upload = multer({ storage: storage });

app.post('/uploadfile', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(req.body, req.headers);
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file);
})

app.delete('/file', /*upload.single('myFile'),*/ (req, res, next) => {
    console.log(req.headers);
    const file = req.headers.filename;
    if (file) {
        try {
            fs.unlinkSync(file);
            return res.status(200).json({
                ok: "Amallga oshirildi!"
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: "Malumot xato berildi!"
            });
        }
    }
});

let port = process.env.PORT;

app.listen(port, () => console.log('Server is listening on port 3003'));