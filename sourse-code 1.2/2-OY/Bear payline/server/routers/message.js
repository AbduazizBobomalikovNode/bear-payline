const express = require("express");
const router = express.Router();

var db = require('../SuperDb/main');
var auth = require("../middlewire/auth");
const { requireAdmin } = auth;
const { canAccessUser, isAdmin } = require("../resurs/funtion/access");
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/message");




router.get("/get/message/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let message = await (await db).message.getMessage(id);
    if (!message) {
        return res.status(404).json({ error: 'ushbu idga mos xabar to\'pilmadi!' });
    }
    if (!canAccessUser(req.user, message.from_user) && !canAccessUser(req.user, message.to_user)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    res.json(
        message
    );
})

router.get("/get/to/:id", auth, async(req, res) => {
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
    const to = await (await db).message.getMessageForTo(id);
    if (!to) {
        return res.status(404).json({ error: 'ushbu idga mos userga yuborilgan xabar to\'pilmadi!' });
    }
    res.json(
        to
    );
})

router.get("/get/from/:id", auth, async(req, res) => {
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
    const from = await (await db).message.getMessageForFrom(id);
    if (!from) {
        return res.status(404).json({ error: 'ushbu idga mos userdan yuborilgan xabar to\'pilmadi!' });
    }
    res.json(
        from
    );
})

router.get('/get/all', auth, requireAdmin, async(req, res) => {
    let message = await (await db).message.getMessageAll();
    res.json(
        message
    );
})

router.post('/add', auth, async(req, res) => {
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    req.body.to_user = parseInt(req.body.to_user);
    req.body.from_user = parseInt(req.body.from_user);
    if (!canAccessUser(req.user, req.body.from_user)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    if (req.body.is_reply == "true") {
        req.body.reply_message = parseInt(req.body.reply_message);
    }

    let body = req.body;
    let message = {
        id: generateId(),
        ...body
    };


    const kimga = await (await db).user.getUser(req.body.to_user);
    const kimdan = await (await db).user.getUser(req.body.from_user);
    if (!kimga || !kimdan) {
        return res.status(404).json(!kimga && !kimdan ? {
            error: 'yuborilgan idga mos jo\'natuvchi va qabul qiluvchi foydalanuvchilar topilmadi to\'pilmadi!'
        } : !kimga ? {
            error: 'yuborilgan idga mos qabul qiluvchi foydalanuvchi topilmadi to\'pilmadi!'
        } : {
            error: 'yuborilgan idga mos jo\'natuvchi foydalanuvchi  topilmadi to\'pilmadi!'
        });
    }

    let result = await (await db).message.addMessage(message);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    res.json(
        message
    );
})

router.put('/uptade/:id', auth, async(req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let body = req.body;
    if (body.hasOwnProperty("to_user")) {
        req.body.to_user = parseInt(req.body.to_user);
    }
    if (body.hasOwnProperty("from_user")) {
        req.body.from_user = parseInt(req.body.from_user);
    }
    let id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }

    if (!body) {
        return res.status(400).json({ error: 'no\'tog\'ri so\'rov. bosh qiymat yuborilgan.' });
    }

    if (body.hasOwnProperty("id")) {
        return res.status(400).json({ error: 'id qiymatini o\'zgartirib bo\'lmaydi.' });
    }

    let message = await (await db).message.getMessage(id);
    if (!message) {
        return res.status(404).json({ error: 'ushbu idga mos xabar to\'pilmadi!' });
    }
    if (!canAccessUser(req.user, message.from_user) && !canAccessUser(req.user, message.to_user)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    if (body.hasOwnProperty("to_user")) {
        const to = await (await db).user.getUser(req.body.to_user);
        if (!to) {
            return res.status(404).json({ error: 'yuborilgan idga mos qabul qiluvchi foydalanuvchi topilmadi to\'pilmadi!' });
        }
    }
    if (body.hasOwnProperty("from_user")) {
        const from = await (await db).user.getUser(req.body.from_user);
        if (!from) {
            return res.status(404).json({ error: 'yuborilgan idga mos jo\'natuvchi foydalanuvchi  topilmadi to\'pilmadi!' });
        }
    }
    let result = await (await db).message.update(id, body);
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

    let message = await (await db).message.getMessage(id);
    if (!message) {
        return res.status(404).json({ error: 'ushbu idga mos xabar to\'pilmadi!' });
    }
    if (!canAccessUser(req.user, message.from_user) && !canAccessUser(req.user, message.to_user)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }

    let result = await (await db).message.delete(id);
    res.json(
        message
    );
})

module.exports = router;