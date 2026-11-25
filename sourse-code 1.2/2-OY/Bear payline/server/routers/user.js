const express = require("express");
const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/user");
var auth = require("../middlewire/auth");
const { requireAdmin } = auth;
const { canAccessUser, isAdmin } = require("../resurs/funtion/access");



router.get("/get/user/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    if (!canAccessUser(req.user, id)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    let user = await (await db).user.getUser(id);
    // let country = await (await db).country.getCountry(user)
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }
    res.json(
        user
    );
})

router.get("/get/role/:id", auth, requireAdmin, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    const role = await (await db).role.getRole(id);
    if (!role) {
        return res.status(404).json({ error: 'ushbu idga mos role to\'pilmadi!' });
    }
    let users = await (await db).user.getUserRole(id);

    res.json(
        users
    );
})

router.get("/get/country/:id", auth, requireAdmin, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    const country = await (await db).country.getCountry(id);
    if (!country) {
        return res.status(404).json({ error: 'ushbu idga mos davlat to\'pilmadi!' });
    }
    let users = await (await db).user.getUserCountry(id);

    res.json(
        users
    );
})

router.get('/get/all', auth, requireAdmin, async(req, res) => {
    let users = await (await db).user.getUserAll();
    res.json(
        users
    );
})

router.post('/add', auth, requireAdmin, async(req, res) => {
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    req.body.idcountry = parseInt(req.body.idcountry);
    req.body.idrole = parseInt(req.body.idrole);
    let body = req.body;
    let user = {
        id: generateId(),
        ...body
    };

    user.email_status = 0;
    user.status = -1;

    const role = await (await db).role.getRole(req.body.idrole);
    const country = await (await db).country.getCountry(req.body.idcountry);
    if (!role || !country) {
        return res.status(404).json(!role && !country ? {
            error: 'yuborilgan idga mos role va davlat topilmadi to\'pilmadi!'
        } : !role ? {
            error: 'yuborilgan idga mos role topilmadi to\'pilmadi!'
        } : {
            error: 'yuborilgan idga mos davlat topilmadi to\'pilmadi!'
        });
    }

    let result = await (await db).user.addUser(user);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    res.json(
        user
    );
})

router.put('/uptade/:id', auth, async(req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let body = req.body;
    if (body.hasOwnProperty("idrole")) {
        req.body.idrole = parseInt(req.body.idrole);
    }
    if (body.hasOwnProperty("idcountry")) {
        req.body.idcountry = parseInt(req.body.idcountry);
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

    if (!canAccessUser(req.user, id)) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    // Oddiy foydalanuvchi o'z rolini/holatini o'zgartira olmaydi (huquqni oshirib yuborishdan himoya)
    if (!isAdmin(req.user) && ['idrole', 'status', 'email_status'].some((k) => body.hasOwnProperty(k))) {
        return res.status(403).json({ error: "Rol va holatni faqat administrator o'zgartira oladi." });
    }
    let user = await (await db).user.getUser(id);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }
    if (body.hasOwnProperty("idrole")) {
        const role = await (await db).role.getRole(req.body.idrole);
        if (!role) {
            return res.status(404).json({ error: 'ushbu idga mos role to\'pilmadi!' });
        }
    }
    if (body.hasOwnProperty("idcountry")) {
        const country = await (await db).country.getCountry(req.body.idcountry);
        if (!country) {
            return res.status(404).json({ error: 'ushbu idga mos davlat to\'pilmadi!' });
        }
    }
    let result = await (await db).user.update(id, body);
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

    let user = await (await db).user.getUser(id);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos user to\'pilmadi!' });
    }

    let result = await (await db).user.delete(id);
    res.json(
        user
    );
})

module.exports = router;