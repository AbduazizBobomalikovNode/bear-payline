const express = require("express");
const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/card");
var auth = require("../middlewire/auth");
const { requireAdmin } = auth;
const { isAdmin } = require("../resurs/funtion/access");

// Karta ma'lumoti (raqam, cvv) faqat egasiga (card_has_user orqali bog'langan) yoki administratorga ko'rinadi.
async function ownsCard(req, idcard) {
    if (isAdmin(req.user)) return true;
    const links = await (await db).cardHasUser.getCardHasUserForUser(Number(req.user.id));
    return Array.isArray(links) && links.some((l) => Number(l.idcard) === Number(idcard));
}





router.get("/get/card/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let card = await (await db).card.getCard(id);
    if (!card) {
        return res.status(404).json({ error: 'ushbu idga mos kard to\'pilmadi!' });
    }
    if (!(await ownsCard(req, id))) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }
    res.json(
        card
    );
})

router.get('/get/all', auth, requireAdmin, async(req, res) => {
    let cards = await (await db).card.getCardAll();
    res.json(
        cards
    );
})

router.post('/add', auth, async(req, res) => {
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let body = req.body;
    let card = {
        id: generateId(),
        ...body
    };

    // user.email_status = 0;
    // user.status = -1;

    let result = await (await db).card.addCard(card);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    res.json(
        card
    );
})

router.put('/uptade/:id', auth, async(req, res) => {
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

    let card = await (await db).card.getCard(id);
    if (!card) {
        return res.status(404).json({ error: 'ushbu idga mos kard to\'pilmadi!' });
    }
    if (!(await ownsCard(req, id))) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }

    let result = await (await db).card.update(id, body);
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

    let card = await (await db).card.getCard(id);
    if (!card) {
        return res.status(404).json({ error: 'ushbu idga mos kard to\'pilmadi!' });
    }
    if (!(await ownsCard(req, id))) {
        return res.status(403).json({ error: "Sizga bu amalni bajarishga ruxsat yo'q." });
    }

    let result = await (await db).card.delete(id);
    res.json(
        card
    );
})

module.exports = router;