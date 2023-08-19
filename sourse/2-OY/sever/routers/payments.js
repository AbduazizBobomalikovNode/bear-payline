const express = require("express");
const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/payments");

setTimeout(async() => { db = await db }, 100);

router.get('/get/payments/:id', async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let payments = await (await db).payments.getPayments(id);
    if (!payments) {
        return res.status(404).json({
            error: 'ushbu idga mos to\'lov to\'pilmadi!'
        });
    }
    res.json(
        payments
    );
})

router.get('/get/user/:id', async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let user = await (await db).user.getUser(id);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }
    let result = await (await db).payments.getPaymentsUser(id);

    res.json(
        result
    );
})

router.get('/get/all', async(req, res) => {
    let result = await (await db).payments.getPaymentsAll();

    res.json(
        result
    );
})

router.post('/add', async(req, res) => {
    if (req.body.hasOwnProperty('amout') && typeof req.body.amout == 'string') {
        req.body.amout.replaceAll(',', ".");
        req.body.amout = parseFloat(req.body.amout);
    }
    if (req.body.hasOwnProperty('commission') && typeof req.body.commission == 'string') {
        req.body.commission.replaceAll(',', ".");
        req.body.commission = parseFloat(req.body.commission);
    }
    req.body.iduser = parseInt(req.body.iduser);
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let body = req.body;
    let payments = {
        id: generateId(),
        ...body
    };
    let user = await (await db).user.getUser(req.body.iduser);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }
    // user.email_status = 0;
    // user.status = -1;

    let result = await (await db).payments.addPayments(payments);
    console.log(result);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    console.log(result);
    res.json(
        payments
    );
})

router.put('/uptade/:id', async(req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    if (req.body.hasOwnProperty('amout') && typeof req.body.amout == 'string') {
        req.body.amout.replaceAll(',', ".");
        req.body.amout = parseFloat(req.body.amout);
    }
    if (req.body.hasOwnProperty('commission') && typeof req.body.commission == 'string') {
        req.body.commission.replaceAll(',', ".");
        req.body.commission = parseFloat(req.body.commission);
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

    let payments = await (await db).payments.getPayments(id);
    if (!payments) {
        return res.status(404).json({ error: 'ushbu idga mos to\'lov to\'pilmadi!' });
    }

    if (body.hasOwnProperty("iduser")) {
        let user = await (await db).user.getUser(req.body.iduser);
        if (!user) {
            return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
        }
    }

    let result = await (await db).payments.update(id, body);
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

    let payments = await (await db).payments.getPayments(id);
    if (!payments) {
        return res.status(404).json({ error: 'ushbu idga mos to\'lov to\'pilmadi!' });
    }

    let result = await (await db).payments.delete(id);
    res.json(
        payments
    );
})

module.exports = router;