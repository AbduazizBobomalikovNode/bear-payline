const express = require("express");
const { upload, sendFile, removeRemote, discard } = require('../resurs/funtion/fileClient');
var auth = require("../middlewire/auth");
const { requireAdmin } = auth;
const { canAccessUser } = require("../resurs/funtion/access");


const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/document");



router.get("/get/document/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let document = await (await db).document.getDocument(id);
    if (!document) {
        return res.status(404).json({ error: 'ushbu idga mos hujat  to\'pilmadi!' });
    }
    if (!canAccessUser(req.user, document.iduser)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    res.json(
        document
    );
})

router.get("/get/user/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    if (!canAccessUser(req.user, id)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    let user = await (await db).user.getUser(id);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }
    let documents = await (await db).document.getDocumentUser(id);

    res.json(
        documents
    );
})

router.get('/get/all', auth, requireAdmin, async(req, res) => {
    let documents = await (await db).document.getDocumentAll();
    res.json(
        documents
    );
})

router.post('/add', auth, upload.single('document'), async(req, res) => {
    const file = req.file;
    const { error } = validate(req.body, "add");
    if (error) {
        discard(file);
        return res.status(400).send(error.details[0].message)
    }
    if (!file) {
        return res.status(400).json({ error: 'hujaatni yuklashda xatolik, hech qanday hujat yuborilmagan.' });
    }
    if (!canAccessUser(req.user, req.body.iduser)) {
        discard(file);
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    req.body.iduser = parseInt(req.body.iduser);
    let body = req.body;
    let document = {
        id: generateId(),
        ...body
    };

    let user = await (await db).user.getUser(req.body.iduser);
    if (!user) {
        discard(file);
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }

    try {
        document.img_url = await sendFile(file);
    } catch (error) {
        console.error('Fayl yuklashda xatolik:', error.message);
        return res.status(500).json({ error: 'hujaatni yuklashda xatolik, qaytadan urinib ko\'ring' });
    }

    let result = await (await db).document.addDocument(document);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    res.json(
        document
    );
})

router.put('/uptade/:id', auth, upload.single('document'), async(req, res) => {
    const file = req.file;
    const { error } = validate(req.body);
    if (error) {
        discard(file);
        return res.status(400).send(error.details[0].message)
    }
    let body = { ...req.body };
    if (body.hasOwnProperty("iduser")) {
        body.iduser = parseInt(body.iduser);
    }
    let id = parseInt(req.params.id);

    if (!id) {
        discard(file);
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }

    if (body.hasOwnProperty("id")) {
        discard(file);
        return res.status(400).json({ error: 'id qiymatini o\'zgartirib bo\'lmaydi.' });
    }

    let document = await (await db).document.getDocument(id);
    if (!document) {
        discard(file);
        return res.status(404).json({ error: 'ushbu idga mos hujjat to\'pilmadi!' });
    }
    if (!canAccessUser(req.user, document.iduser)) {
        discard(file);
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }

    if (body.hasOwnProperty("iduser")) {
        if (!canAccessUser(req.user, body.iduser)) {
            discard(file);
            return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
        }
        let user = await (await db).user.getUser(body.iduser);
        if (!user) {
            discard(file);
            return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
        }
    }
    if (file) {
        try {
            const newUrl = await sendFile(file);
            try {
                await removeRemote(document.img_url);
            } catch (e) {
                console.error('Eski faylni o\'chirishda xatolik:', e.message);
            }
            body.img_url = newUrl;
        } catch (error) {
            console.error('Fayl yuklashda xatolik:', error.message);
            return res.status(500).json({ error: 'hujaatni yuklashda xatolik, qaytadan urinib ko\'ring' });
        }
    }
    let result = await (await db).document.update(id, body);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    res.json(
        result
    );
})

router.delete('/delete/:id', auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }

    let document = await (await db).document.getDocument(id);
    if (!document) {
        return res.status(404).json({ error: 'ushbu idga mos hujjat to\'pilmadi!' });
    }
    if (!canAccessUser(req.user, document.iduser)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    try {
        await removeRemote(document.img_url);
    } catch (error) {
        console.error('Faylni o\'chirishda xatolik:', error.message);
        return res.status(500).json({ error: 'serverda xatolik yuz berdi, qaytatdan urinib ko\'ring.' });
    }
    let result = await (await db).document.delete(id);
    res.json(
        document
    );
})

module.exports = router;
