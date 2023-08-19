const express = require("express");
const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/user");


setTimeout(async() => { db = await db }, 100);


router.get("/get/user/:id", async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let user = await (await db).user.getUser(id);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }
    res.json(
        user
    );
})

router.get("/get/role/:id", async(req, res) => {
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

router.get("/get/country/:id", async(req, res) => {
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

router.get('/get/all', async(req, res) => {
    let users = await (await db).user.getUserAll();
    res.json(
        users
    );
})

router.post('/add', async(req, res) => {
    req.body.idrole = parseInt(req.body.idrole);
    req.body.idcountry = parseInt(req.body.idcountry);
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
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
    console.log(result);
    res.json(
        user
    );
})

router.put('/uptade/:id', async(req, res) => {
    req.body.idrole = parseInt(req.body.idrole);
    req.body.idcountry = parseInt(req.body.idcountry);
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    let body = req.body;
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

router.delete('/delete/:id', async(req, res) => {
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