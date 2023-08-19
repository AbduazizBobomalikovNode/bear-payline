const express = require("express");
const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/card_has_user");
var auth = require("../middlewire/auth");


setTimeout(async() => { db = await db }, 100);

router.get("/get/chu/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let cardHasUser = await (await db).cardHasUser.getCardHasUser(id);
    if (!cardHasUser) {
        return res.status(404).json({ error: 'ushbu idga mos kardga ega foydalanuvchi to\'pilmadi!' });
    }
    res.json(
        cardHasUser
    );
})

router.get("/get/card/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let card = await (await db).card.getCard(id);
    if (!card) {
        return res.status(404).json({ error: 'ushbu idga mos karta to\'pilmadi!' });
    }
    let cardHasUser = await (await db).cardHasUser.getCardHasUserForCard(id);

    res.json(
        cardHasUser
    );
})

router.get("/get/user/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let user = await (await db).user.getUser(id);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }
    let cardHasUser = await (await db).cardHasUser.getCardHasUserForUser(id);

    res.json(
        cardHasUser
    );
})

router.get('/get/all', auth, async(req, res) => {
    let cardHasUser = await (await db).cardHasUser.getCardHasUserAll();
    res.json(
        cardHasUser
    );
})

router.post('/add', auth, async(req, res) => {
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    req.body.idcard = parseInt(req.body.idcard);
    req.body.iduser = parseInt(req.body.iduser);
    let body = req.body;
    let cardHasUser = {
        id: generateId(),
        ...body
    };

    // user.email_status = 0;
    // user.status = -1;

    const card = await (await db).card.getCard(req.body.idcard);
    const user = await (await db).user.getUser(req.body.iduser);
    if (!card || !user) {
        return res.status(404).json(!card && !user ? {
            error: 'yuborilgan idga mos karta va foydalanuvchi  to\'pilmadi!'
        } : !card ? {
            error: 'yuborilgan idga mos karta  to\'pilmadi!'
        } : {
            error: 'yuborilgan idga mos foydalanuvchi  to\'pilmadi!'
        });
    }

    let result = await (await db).cardHasUser.addCardHasUser(cardHasUser);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    console.log(result);
    res.json(
        cardHasUser
    );
})

router.put('/uptade/:id', auth, async(req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    if (body.hasOwnProperty("idcard")) {
        req.body.idcard = parseInt(req.body.idcard);
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

    let cardHasUser = await (await db).cardHasUser.getCardHasUser(id);
    if (!cardHasUser) {
        return res.status(404).json({ error: 'ushbu idga mos kartaga bog\'liq foydalanuvchi to\'pilmadi!' });
    }

    if (body.hasOwnProperty("iduser")) {
        req.body.iduser = parseInt(req.body.iduser);
        let user = await (await db).user.getUser(req.body.iduser);
        if (!user) {
            return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
        }
    }
    if (body.hasOwnProperty("idcard")) {
        req.body.idcard = parseInt(req.body.idcard);
        let card = await (await db).card.getCard(req.body.idcard);
        if (!card) {
            return res.status(404).json({ error: 'ushbu idga mos karta to\'pilmadi!' });
        }
    }
    body = req.body;

    let result = await (await db).cardHasUser.update(id, body);
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

    let cradHasUser = await (await db).cradHasUser.getCardHasUser(id);
    if (!cradHasUser) {
        return res.status(404).json({ error: 'ushbu idga mos user to\'pilmadi!' });
    }

    let result = await (await db).cardHasUser.delete(id);
    res.json(
        cradHasUser
    );
})

module.exports = router;