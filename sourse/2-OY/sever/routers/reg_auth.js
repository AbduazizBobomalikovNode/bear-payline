const express = require('express');
const Auth = express.Router();
const jwt = require('jsonwebtoken');
const jwt_my_key = "***REMOVED***";
var db = require('../SuperDb/main');
var generateId = require('../resurs/funtion/getid');

setInterval(async() => { db = await db }, 100);

Auth.post('/login', async(req, res) => {
    const auth = req.body;
    if (auth.hasOwnProperty('phone') && searchCountryCodes(auth.phone)) {
        let result = null;
        try {
            result = await sendCode(auth.phone, res);
        } catch (error) {
            return res.status(500).json({ error: "serverda xatolik mavjut  keyinroq urinib ko'ring" });
        }
        if (result) {
            return res.status(200).json({
                status: auth.phone + "telefon raqamga tasdiqlash kodi yuborildi.",
                cheksId: result
            });
        } else {
            return res.status(400).json({ error: auth.phone + "telefon raqamga  xbar jo'natip bo'lmadi" });
        }
    } else {
        return res.status(400).json({ error: "telefon raqam xato!." });
    }
});
Auth.post('/chek', async(req, res) => {
    req.body.id = parseInt(req.body.id);
    // req.body.code = parseInt(req.body.code);
    const chek = req.body;
    const result = await db.cheks.getCheks(chek.id);
    console.log("/chek ", result, chek);
    if (result) {
        if (result.code == chek.code) {
            const del = await (await db).cheks.delete(chek.id);
            const results = await db.user.getUserForObj({ phone: result.phone });
            if (results) {
                const roleUser = await db.role.getRole(results.idrole);
                delete results.idrole;
                const tokenExpireTime = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // current time + 1 hour
                results.exp = tokenExpireTime;
                results.licence = roleUser.licence;
                results.role = roleUser.role;
                const token = jwt.sign({...results }, jwt_my_key);
                if (results) {
                    return res.header('x-web-token', token).status(200).json({ info: 'hisobga kirish mufaqiyatli.' });
                }
            } else {
                let idCountry = await searchCountryCodes(result.phone);
                let idRole = await (await db).role.getRoleForObj({ role: "user" });
                console.log(idCountry, idRole);
                if (idRole) {
                    console.log(result);
                    let user = {
                        id: generateId(),
                        full_name: "unknown name",
                        phone: result.phone,
                        idcountry: idCountry,
                        idrole: idRole.id,
                        email_status: 0,
                        status: -1
                    };
                    let resultUser = await (await db).user.addUser(user);
                    if (resultUser.error) {
                        console.log(resultUser.error);
                        return res.status(500).json({ error: "serverda xatolik mavjut  keyinroq urinib ko'ring." });
                    } else {
                        const tokenExpireTime = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // current time + 1 hour
                        resultUser.exp = tokenExpireTime;
                        resultUser.licence = idRole.licence;
                        resultUser.role = idRole.role;
                        const token = jwt.sign({...resultUser }, jwt_my_key);
                        if (resultUser) {
                            return res.header('x-web-token', token).status(200).json({ info: 'hisobga kirish mufaqiyatli.' });
                        }
                    }
                    console.log("is new! user");
                } else {
                    return res.status(500).json({ error: "serverda xatolik mavjut  keyinroq urinib ko'ring." });
                }
            }
        } else {
            console.log("Erorr 400", result, result.code, chek.code, result.code == chek.code);
            return res.status(400).json({ error: "tasdiqlash kodi xato!." });
        }
    } else {
        console.log("Erorr 400", result);
        return res.status(400).json({ error: "tasdiqlashda  xatolikiltimos qaytadan urinib ko'ring!." });
    }

});
module.exports = Auth;

async function sendCode(phone, res) {
    let cheks = {
        id: generateId(),
        phone: phone,
        code: generateId(5) + "",
        date: (new Date()).valueOf() + 10 * 60 * 1000
    };
    sendSMSCode(phone.slice(1), cheks.code);
    const result = await db.cheks.addCheks(cheks);
    if (result.error) {
        console.log(result.error);
        throw "serverda xatolik tasdiqlash yaratishda";
    }
    console.log(cheks);
    return cheks.id;
}
async function searchCountryCodes(phone) {
    let oneCode = phone.slice(0, 2);
    let twoCode = phone.slice(0, 3);
    let threeCode = phone.slice(0, 4);
    let fourCode = phone.slice(0, 5);
    let Country = await db.country.getCountryForObj({ phone_code: oneCode });
    if (Country) {
        return Country.id;
    }
    Country = null;
    Country = await db.country.getCountryForObj({ phone_code: twoCode });
    if (Country) {
        return Country.id;
    }
    Country = null;
    Country = await db.country.getCountryForObj({ phone_code: threeCode });
    if (Country) {
        return Country.id;
    }
    Country = null;
    Country = await db.country.getCountryForObj({ phone_code: fourCode });
    if (Country) {
        return Country.id;
    }
    return null;
}


async function postLogin() {
    try {
        const response = await fetch('https://notify.eskiz.uz/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: '***REMOVED***',
                password: '***REMOVED***'
            })
        });
        const result = await response.json();
        console.log('Response:', result);
        return result.data.token;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
async function sendSMSCode(phone, code) {
    try {
        let token = await postLogin();
        console.log(token);
        const response = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                mobile_phone: phone,
                message: 'salom sizning tasdiqlash kodingiz ' + code,
                from: '4546'
            })
        });
        const result = await response.json();
        console.log('Response:', result);
        return result.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
// const auth = req.body;
// console.log(auth)
// 
// if (!result) {
//     return res.status(400).json({ error: "login yoki parol no'tog'ri." });
// }
// const userRole = await db.role.getRole(result.idRole);

// if (!result)
//     return res.status(400).json({ error: "login yoki parol no'tog'ri." });
// const checked = await bcrypt.compare(auth.password, result.password);
// if (!(checked))
//     return res.status(400).json({ error: "login yoki parol no'tog'ri." });

// const tokenExpireTime = Math.floor(Date.now() / 1000) + (60 * 60); // current time + 1 hour
// result.exp = tokenExpireTime;
// result.licence = userRole.licence;
// result.role = userRole.name;
// action(result, db, 'auth');
// const token = jwt.sign({...result }, jwt_my_key);
// if (result) {
//     return res.header('x-web-token', token).status(200).json({ info: 'hisobga kirish mufaqiyatli.' });
// } else {
//     return res.status(401).json({ error: "login yoki parol no'tog'ri." });
// } else {
//     return res.status(401).json({ error: "login yoki parol no'tog'ri." });
// }