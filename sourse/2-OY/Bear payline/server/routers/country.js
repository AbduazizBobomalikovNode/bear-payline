const express = require("express");
const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/country");
var auth = require("../middlewire/auth");

setTimeout(async() => { db = await db }, 100);

router.get("/get/country/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let country = await (await db).country.getCountry(id);
    if (!country) {
        return res.status(404).json({ error: 'ushbu idga mos davalat to\'pilmadi!' });
    }
    res.json(
        country
    );
})

router.get('/get/all', async(req, res) => {
    let countrys = await (await db).country.getCountryAll();
    res.json(
        countrys
    );
})

router.post('/add', auth, async(req, res) => {
    if (req.body.hasOwnProperty('commission') && typeof req.body.commission == 'string') {
        req.body.commission.replaceAll(',', ".");
        req.body.commission = parseFloat(req.body.commission);
    }
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let body = req.body;
    let country = {
        id: generateId(),
        ...body
    };

    // user.email_status = 0;
    // user.status = -1;

    let result = await (await db).country.addCountry(country);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    console.log(result);
    res.json(
        country
    );
})

router.put('/uptade/:id', auth, async(req, res) => {
    if (req.body.hasOwnProperty('commission') && typeof req.body.commission == 'string') {
        req.body.commission.replaceAll(',', ".");
        req.body.commission = parseFloat(req.body.commission);
    }
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

    let country = await (await db).country.getCountry(id);
    if (!country) {
        return res.status(404).json({ error: 'ushbu idga mos davlat to\'pilmadi!' });
    }

    let result = await (await db).country.update(id, body);
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

    let country = await (await db).country.getCountry(id);
    if (!country) {
        return res.status(404).json({ error: 'ushbu idga mos davlat to\'pilmadi!' });
    }

    let result = await (await db).country.delete(id);
    res.json(
        country
    );
})

module.exports = router;