const express = require("express");
const { upload, sendFile, removeRemote, discard } = require('../resurs/funtion/fileClient');
var auth = require("../middlewire/auth");
const { requireAdmin } = auth;

const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/news");


router.get("/get/news/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let news = await (await db).news.getNews(id);
    if (!news) {
        return res.status(404).json({ error: 'ushbu idga mos reklama to\'pilmadi!' });
    }
    res.json(
        news
    );
})

router.get('/get/all', async(req, res) => {
    let news = await (await db).news.getNewsAll();
    res.json(
        news
    );
})

router.post('/add', auth, requireAdmin, upload.single('document'), async(req, res) => {
    const file = req.file;
    const { error } = validate(req.body, "add");
    if (error) {
        discard(file);
        return res.status(400).send(error.details[0].message)
    }
    if (!file) {
        return res.status(400).json({ error: 'hujaatni yuklashda xatolik, hech qanday hujat yuborilmagan.' });
    }
    let body = req.body;
    let news = {
        id: generateId(),
        ...body
    };

    try {
        news.img_url = await sendFile(file);
    } catch (error) {
        console.error('Fayl yuklashda xatolik:', error.message);
        return res.status(500).json({ error: 'hujaatni yuklashda xatolik, qaytadan urinib ko\'ring' });
    }

    let result = await (await db).news.addNews(news);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    res.json(
        news
    );
})

router.put('/uptade/:id', auth, requireAdmin, upload.single('document'), async(req, res) => {
    const file = req.file;
    const { error } = validate(req.body);
    if (error) {
        discard(file);
        return res.status(400).send(error.details[0].message)
    }
    let body = { ...req.body };
    let id = parseInt(req.params.id);

    if (!id) {
        discard(file);
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }

    if (body.hasOwnProperty("id")) {
        discard(file);
        return res.status(400).json({ error: 'id qiymatini o\'zgartirib bo\'lmaydi.' });
    }

    let news = await (await db).news.getNews(id);
    if (!news) {
        discard(file);
        return res.status(404).json({ error: 'ushbu idga mos reklama to\'pilmadi!' });
    }

    if (file) {
        try {
            const newUrl = await sendFile(file);
            try {
                await removeRemote(news.img_url);
            } catch (e) {
                console.error('Eski faylni o\'chirishda xatolik:', e.message);
            }
            body.img_url = newUrl;
        } catch (error) {
            console.error('Fayl yuklashda xatolik:', error.message);
            return res.status(500).json({ error: 'hujaatni yuklashda xatolik, qaytadan urinib ko\'ring' });
        }
    }

    let result = await (await db).news.update(id, body);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    res.json(
        result
    );
})

router.delete('/delete/:id', auth, requireAdmin, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }

    let news = await (await db).news.getNews(id);
    if (!news) {
        return res.status(404).json({ error: 'ushbu idga mos reklama to\'pilmadi!' });
    }

    try {
        await removeRemote(news.img_url);
    } catch (error) {
        console.error('Faylni o\'chirishda xatolik:', error.message);
        return res.status(500).json({ error: 'serverda xatolik yuz berdi, qaytatdan urinib ko\'ring.' });
    }
    let result = await (await db).news.delete(id);
    res.json(
        news
    );
})

module.exports = router;
