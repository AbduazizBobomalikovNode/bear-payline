const express = require("express");
const multer = require('multer');
const axios = require('axios').default;
const fs = require('fs');
const FormData = require('form-data');
const upload = multer({ dest: 'resurs/uploads/' });
var auth = require("../middlewire/auth");


const fileUrl = process.env.HOST_FILE_SERVER ? process.env.HOST_FILE_SERVER : 'https://bear-payline-file-server-f81c965e266f.herokuapp.com'; // the URL of the other server
const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/document");


setTimeout(async() => { db = await db }, 100);

router.get("/get/document/:id", auth, async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let document = await (await db).document.getDocument(id);
    if (!document) {
        return res.status(404).json({ error: 'ushbu idga mos hujat  to\'pilmadi!' });
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
    let user = await (await db).user.getUser(id);
    if (!user) {
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }
    let documents = await (await db).document.getDocumentUser(id);

    res.json(
        documents
    );
})

router.get('/get/all', auth, async(req, res) => {
    let documents = await (await db).document.getDocumentAll();
    res.json(
        documents
    );
})

router.post('/add', auth, upload.single('document'), async(req, res) => {
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const file = req.file;
    req.body.iduser = parseInt(req.body.iduser);
    if (!file) {
        res.status(400).json({ error: 'hujaatni yuklashda xatolik, hech qanday hujat yuborilmagan.' });
    }
    let body = req.body;
    let document = {
        id: generateId(),
        ...body,
        img_url: file.path
    };

    let user = await (await db).user.getUser(req.body.iduser);
    if (!user) {
        console.log(req.body);
        if (file) {
            fs.unlinkSync(file.path);
        }
        return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(file.path), {
        filename: file.originalname,
        contentType: file.mimetype,
    });
    try {
        const response = await axios.post(fileUrl + "/uploadfile", form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        fs.unlinkSync(file.path); // delete the file from the 'uploads' directory

        let url_doc = fileUrl + '/images/' + response.data.filename;
        document.img_url = url_doc;
        console.log(response.data, url_doc);
    } catch (error) {
        console.error(error);
        // res.status(500).send('An error occurred.');
        return res.status(500).json({ error: 'hujaatni yuklashda xatolik, qaytadan urinib ko\'ring' });
    }


    let result = await (await db).document.addDocument(document);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    console.log(result);
    res.json(
        document
    );
})



router.put('/uptade/:id', auth, upload.single('document'), async(req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const file = req.file;
    if (body.hasOwnProperty("iduser")) {
        req.body.iduser = parseInt(req.body.iduser);
    }

    let body = {
        ...req.body,
        img_url: "sfdfsdv"
    };

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

    let document = await (await db).document.getDocument(id);
    if (!document) {
        return res.status(404).json({ error: 'ushbu idga mos hujjat to\'pilmadi!' });
    }

    if (body.hasOwnProperty("iduser")) {
        let user = await (await db).user.getUser(req.body.iduser);
        if (!user) {
            return res.status(404).json({ error: 'ushbu idga mos foydalanuvchi to\'pilmadi!' });
        }
    }
    if (file) {
        const form = new FormData();
        form.append('file', fs.createReadStream(file.path), {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        try {
            let deleteUrl = "./uploads/" + document.img_url.replaceAll(fileUrl + "/images/", "");
            console.log(deleteUrl);
            let options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'filename': deleteUrl
                }
            };
            const deleteFile = await fetch(fileUrl + "/file", options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Tarmoq javobi yaxshi emas edi');
                    }
                    return response.json();
                })
                .then(data => {
                    // if (data.hasOwnProperty("error")) {
                    //     throw new Error('Tarmoq javobi yaxshi emas edi');
                    // }
                    return data;
                });

            if (deleteFile.status == 200) {
                const response = await axios.post(fileUrl + "/uploads", form, {
                    headers: {
                        ...form.getHeaders(),
                    },
                });

                fs.unlinkSync(file.path); // delete the file from the 'uploads' directory

                let url_doc = 'http://localhost:3003/images/' + response.data.filename;
                body.img_url = url_doc;
                console.log(response.data, url_doc);
            } else {
                fs.unlinkSync(file.path);
                return res.status(500).json({ error: 'serverda xatolik yuz berdi, qaytatdan urinib ko\'ring.' });
            }

        } catch (error) {
            console.error(error);
            // res.status(500).send('An error occurred.');
            res.status(500).json({ error: 'hujaatni yuklashda xatolik, qaytadan urinib ko\'ring' });
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
    try {
        let deleteUrl = "./uploads/" + document.img_url.replaceAll(fileUrl + "/images/", "");
        console.log(deleteUrl);
        let options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'filename': deleteUrl
            }
        };
        const deleteFile = await fetch(fileUrl + "/file", options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Tarmoq javobi yaxshi emas edi');
                }
                return response.json();
            })
            .then(data => {
                // if (data.hasOwnProperty("error")) {
                //     throw new Error('Tarmoq javobi yaxshi emas edi');
                // }
                return data;
            });
        console.log(deleteFile);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'serverda xatolik yuz berdi, qaytatdan urinib ko\'ring.' });
    }
    let result = await (await db).document.delete(id);
    res.json(
        document
    );
})

module.exports = router;