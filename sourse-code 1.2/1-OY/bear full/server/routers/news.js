const express = require("express");
const multer = require('multer');
const axios = require('axios').default;
const fs = require('fs');
const FormData = require('form-data');
const upload = multer({ dest: 'resurs/uploads/' });

const fileUrl = process.env.HOST_FILE_SERVER ? process.env.HOST_FILE_SERVER : 'https://bear-payline-file-server-f81c965e266f.herokuapp.com'; // the URL of the other server
// const fileUrl = 'https://bear-payline-file-server-f81c965e266f.herokuapp.com'; // the URL of the other server
const router = express.Router();

var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');
const validate = require("../resurs/validate-sxema/news");

setTimeout(async() => { db = await db }, 100);

router.get("/get/news/:id", async(req, res) => {
    let id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'id xato berildi, id butun son qiymat bo\'lishi shart' });
    }
    let news = await (await db).news.getNews(id);
    if (!news) {
        return res.status(404).json({ error: 'ushbu idga mos reklama to\'pilmadi!' });
    }
    res.json(
        news
    );
})

router.get('/get/all', async(req, res) => {
    let news = await (await db).news.getNewsAll();
    res.json(
        news
    );
})

router.post('/add', upload.single('document'), async(req, res) => {
    const file = req.file;
    const { error } = validate(req.body, "add");
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    if (!file) {
        res.status(400).json({ error: 'hujaatni yuklashda xatolik, hech qanday hujat yuborilmagan.' });
    }
    let body = req.body;
    let news = {
        id: generateId(),
        ...body
    };

    // user.email_status = 0;
    // user.status = -1;
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
        res.status(500).json({ error: 'hujaatni yuklashda xatolik, qaytadan urinib ko\'ring' });
    }

    let result = await (await db).news.addNews(news);
    if (result.hasOwnProperty('error')) {
        return res.status(400).json(
            result
        );
    }
    console.log(result);
    res.json(
        news
    );
})

router.put('/uptade/:id', upload.single('document'), async(req, res) => {
    const file = req.file;
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    let body = {
        ...req.body,
        img_url: "dvxdvd"
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

    let news = await (await db).news.getNews(id);
    if (!news) {
        return res.status(404).json({ error: 'ushbu idga mos reklama to\'pilmadi!' });
    }

    if (file) {
        const form = new FormData();
        form.append('file', fs.createReadStream(file.path), {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        try {
            let deleteUrl = "./uploads/" + news.img_url.replaceAll(fileUrl + "/images/", "");
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

    let result = await (await db).news.update(id, body);
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

    let news = await (await db).news.getNews(id);
    if (!news) {
        return res.status(404).json({ error: 'ushbu idga mos reklama to\'pilmadi!' });
    }

    try {
        let deleteUrl = "./uploads/" + news.img_url.replaceAll(fileUrl + "/images/", "");
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

    let result = await (await db).news.delete(id);
    res.json(
        news
    );
})

module.exports = router;