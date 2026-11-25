const express = require('express');
const multer = require('multer');
const fs = require('fs');
const BOT_TOKEN = process.env.BOT_TOKEN;
const { Telegraf } = require('telegraf');
const app = express();
const bot = new Telegraf(BOT_TOKEN);
const admin = 1061876976;
var message = null;



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
    // console.log(req.body, req.headers);
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400;
        log("serverga   fayllsiz murajat bo'ldi!");
        return next(error)
    }
    log("serverga fayl  saqlandi!\n" + JSON.stringify(file));
    res.send(file);
})

app.delete('/file', /*upload.single('myFile'),*/ (req, res, next) => {
    const file = req.headers.filename;
    if (file) {
        try {
            fs.unlinkSync(file);
            log(file + " - fayli serverdan  o'chirildi");
            return res.status(200).json({
                ok: "Amallga oshirildi!"
            });
        } catch (error) {
            console.log(error);
            log(file + " - fayli serverdan  o'chirishda   xatolik yuzaga keldi!\nxato:\n" + JSON.stringify(error));
            return res.status(400).json({
                error: "Malumot xato berildi!"
            });
        }
    }
});

let port = process.env.PORT;

// bot.start((ctx) => {
//     ctx.reply(ctx.message.text);
//     console.log(ctx.message);
// });
function log(text) {
    bot.telegram.sendMessage(admin, text + "\nsana va qaqt:  " + (new Date()).toString());
}
app.listen(port, () => {
    log("server ishga tushti!");
    bot.launch();
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
    console.log('Server is listening on port 3003')
});