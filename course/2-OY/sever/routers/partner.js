const express = require("express");
const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/partner");

setTimeout(async() => { db = await db }, 100);

router.get("/get/partner/:id", async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let partner = await (await db).partner.getPartner(id);
    if (!partner) {
        return res.status(404).json({ error: 'ushbu idga mos hamkor to\'pilmadi!' });
    }
    res.json(
        partner
    );
})

router.get("/get/user/:id", async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let user = await (await db).user.getUser(id);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }
    let partner = await (await db).partner.getPartnerUser(id);

    res.json(
        partner
    );
})

router.get('/get/all', async(req, res) => {
    let partner = await (await db).partner.getPartnerAll();
    res.json(
        partner
    );
})

router.post('/add', async(req, res) => {
    req.body.iduser = parseInt(req.body.iduser);
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let body = req.body;
    let partner = {
        id: generateId(),
        ...body
    };

    // user.email_status = 0;
    // user.status = -1;

    let user = await (await db).user.getUser(req.body.iduser);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }

    let result = await (await db).partner.addPartner(partner);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    console.log(result);
    res.json(
        partner
    );
})

router.put('/uptade/:id', async(req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    if (body.hasOwnProperty("iduser")) {
        req.body.iduser = parseInt(req.body.iduser);
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

    let partner = await (await db).partner.getPartner(id);
    if (!partner) {
        return res.status(404).json({ error: 'ushbu idga mos hamkor to\'pilmadi!' });
    }
    if (body.hasOwnProperty("iduser")) {
        let user = await (await db).user.getUser(req.body.iduser);
        if (!user) {
            return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
        }
    }
    let result = await (await db).partner.update(id, body);
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

    let partner = await (await db).partner.getPartner(id);
    if (!partner) {
        return res.status(404).json({ error: 'ushbu idga mos hamkor to\'pilmadi!' });
    }

    let result = await (await db).partner.delete(id);
    res.json(
        partner
    );
})

module.exports = router;