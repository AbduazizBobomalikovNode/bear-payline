const express = require("express");
const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/device");
var auth = require("../middlewire/auth");
const { requireAdmin } = auth;
const { canAccessUser } = require("../resurs/funtion/access");



router.get("/get/device/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let device = await (await db).device.getDevice(id);
    if (!device) {
        return res.status(404).json({ error: 'ushbu idga mos qurilma to\'pilmadi!' });
    }
    if (!canAccessUser(req.user, device.iduser)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    res.json(
        device
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
    let device = await (await db).device.getDeviceUser(id);

    res.json(
        device
    );
})

router.get('/get/all', auth, requireAdmin, async(req, res) => {
    let device = await (await db).device.getDeviceAll();
    res.json(
        device
    );
})

router.post('/add', auth, async(req, res) => {
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    if (!canAccessUser(req.user, req.body.iduser)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    req.body.iduser = parseInt(req.body.iduser);
    let body = req.body;
    let device = {
        id: generateId(),
        ...body
    };


    // user.email_status = 0;
    // user.status = -1;

    let user = await (await db).user.getUser(req.body.iduser);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }


    let result = await (await db).device.addDevice(device);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    res.json(
        device
    );
})

router.put('/uptade/:id', auth, async(req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let body = req.body;
    if (body.hasOwnProperty("iduser")) {
        req.body.iduser = parseInt(req.body.iduser);
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

    let device = await (await db).device.getDevice(id);
    if (!device) {
        return res.status(404).json({ error: 'ushbu idga mos qurilma to\'pilmadi!' });
    }
    if (!canAccessUser(req.user, device.iduser)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }

    if (body.hasOwnProperty("iduser")) {

        if (!canAccessUser(req.user, req.body.iduser)) {
            return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
        }
        let user = await (await db).user.getUser(req.body.iduser);
        if (!user) {
            return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
        }
    }
    // body = req.body;

    let result = await (await db).device.update(id, body);
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

    let device = await (await db).device.getDevice(id);
    if (!device) {
        return res.status(404).json({ error: 'ushbu idga mos hujjat to\'pilmadi!' });
    }
    if (!canAccessUser(req.user, device.iduser)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }

    let result = await (await db).device.delete(id);
    res.json(
        device
    );
})

module.exports = router;