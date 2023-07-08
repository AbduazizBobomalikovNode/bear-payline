async function testUser() {
    const db = await require('./MySqlModule/main');

    console.log(db);
    let user = await db.user.addUser({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        full_name: "salom",
        phone: "+9989166643" + parseInt((Math.random() * 100000) % 10000),
        address: "Farg'ona",
        idcountry: 156878787,
        idrole: 4548787
    });
    let update = await db.user.update(user.id, { address: "kurtlar vodiysi" });
    let users = await db.user.getUserAll();
    let getuser = await db.user.getUser(user.id);
    let getuserRole = await db.user.getUserRole(user.idrole);
    let getUserCountry = await db.user.getUserCountry(user.idcountry);
    let delet = await db.user.delete(user.id);

    console.log(user, users, delet, update, getuser, getuserRole, getUserCountry);
    db.close();
}
async function testUserErr() {
    const db = await require('./MySqlModule/main');

    console.log(db);
    let user = await db.user.addUser({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        full_name: "salom",
        phone: "+9989166643" + parseInt((Math.random() * 100000) % 10000)
    });
    let update = await db.user.update(5454878, { address: "kurtlar vodiysi" });
    let users = await db.user.getUserAll();
    let getuser = await db.user.getUser(654454);
    let delet = await db.user.delete(454545);

    console.log(user, users, delet, update, getuser);
    db.close();
}
async function testNews() {
    const db = await require('./MySqlModule/main');

    console.log(db);
    let anews = await db.news.addNews({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        title: "salom",
        content: "+9989166643" + parseInt((Math.random() * 100000) % 10000),
        img_url: "Farg'ona"
    });
    let update = await db.news.update(anews.id, { content: "kurtlar vodiysi" });
    let newss = await db.news.getNewsAll();
    let getnews = await db.news.getNews(anews.id);
    let delet = await db.news.delete(anews.id);

    console.log(newss, anews, update, getnews, delet);
    db.close();
}
async function testCountry() {
    const db = await require('./MySqlModule/main');

    console.log(db);
    let country = await db.country.addCountry({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        name: "O'zbekiston",
        code: "" + parseInt((Math.random() * 100000) % 1000),
        phone_code: "+998",
        lang_arr: "[uz,ru,eng]",
        currency: "UZS",
        commission: 2,
    });
    let update = await db.country.update(country.id, { commission: 3 });
    let newss = await db.country.getCountryAll();
    let getnews = await db.country.getCountry(country.id);
    let delet = await db.country.delete(country.id);

    console.log(newss, country, update, getnews, delet);
    db.close();
}
async function testPayments() {
    const db = await require('./MySqlModule/main');

    console.log((new Date()).toISOString().slice(0, 19).replace('T', ' '));
    let country = await db.payments.addPayments({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        iduser: 1514187 + parseInt((new Date()).getMilliseconds()),
        date: (new Date()).toISOString().slice(0, 19).replace('T', ' ') + "",
        sender_card_number: "86000145457878",
        amout: 250000,
        currency: "UZS",
        receiver_card_number: "86000145457878",
        receiver_full_name: "Bobomalikov Abduazi",
        commission: 3,
        method: "VisaToUzkard",
    });
    let update = await db.payments.update(country.id, { commission: 7 });
    let newss = await db.payments.getPaymentsAll();
    let getnews = await db.payments.getPayments(country.id);
    let getPaymentsUser = await db.payments.getPaymentsUser(country.iduser);
    let delet = await db.payments.delete(country.id);

    console.log(newss, country, update, getnews, delet, getPaymentsUser);
    db.close();
}
async function testCard() {
    const db = await require('./MySqlModule/main');
    let country = await db.card.addCard({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        number: "86000145457878",
        full_name: "Bobomalikov Abduaziz",
        date: (new Date()).toISOString().slice(0, 19).replace('T', ' ') + "",
        cvv: "123"
    });
    let update = await db.card.update(country.id, { commission: 7 });
    let newss = await db.card.getCardAll();
    let getnews = await db.card.getCard(country.id);
    let delet = await db.card.delete(country.id);

    console.log(newss, country, update, getnews, delet);
    db.close();
}
async function testCardHasUser() {
    const db = await require('./MySqlModule/main');
    let country = await db.cardHasUser.addCardHasUser({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        idcard: 1514187 + parseInt((new Date()).getMilliseconds()),
        iduser: 1514187 + parseInt((new Date()).getMilliseconds())
    });
    let update = await db.cardHasUser.update(country.id, { idcard: 1514187 + parseInt((new Date()).getMilliseconds()) });
    let newss = await db.cardHasUser.getCardHasUserAll();
    let getnews = await db.cardHasUser.getCardHasUser(country.id);
    let getCardHasUserForUser = await db.cardHasUser.getCardHasUserForUser(getnews.iduser);
    let getCardHasUserForCard = await db.cardHasUser.getCardHasUserForCard(getnews.idcard);
    let delet = await db.cardHasUser.delete(country.id);

    console.log(newss, country, update, getnews, delet, getCardHasUserForUser, getCardHasUserForCard);
    db.close();
}
async function testPartner() {
    const db = await require('./MySqlModule/main');
    let country = await db.partner.addPartner({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        card_number: "565989855487",
        name: "Bobomalikov Abduaziz",
        iduser: 1514187 + parseInt((new Date()).getMilliseconds())
    });
    let update = await db.partner.update(country.id, { name: 1514187 + parseInt((new Date()).getMilliseconds()) });
    let newss = await db.partner.getPartnerAll();
    let getnews = await db.partner.getPartner(country.id);
    let getPartnerUser = await db.partner.getPartnerUser(country.iduser);
    let delet = await db.partner.delete(country.id);

    console.log(newss, country, update, getnews, delet, getPartnerUser);
    db.close();
}
async function testRole() {
    const db = await require('./MySqlModule/main');
    let country = await db.role.addRole({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        role: "admin" + parseInt((new Date()).getMilliseconds()),
        licence: "Bobomalikov Abduaziz"
    });
    let update = await db.role.update(country.id, { licence: 1514187 + parseInt((new Date()).getMilliseconds()) });
    let newss = await db.role.getRoleAll();
    let getnews = await db.role.getRole(country.id);
    let delet = await db.role.delete(country.id);

    console.log(newss, country, update, getnews, delet);
    db.close();
}
async function testDevice() {
    const db = await require('./MySqlModule/main');
    let country = await db.device.addDevice({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        date: (new Date()).toISOString().slice(0, 19).replace('T', ' ') + "",
        model: "Redmi s" + parseInt((new Date()).getMilliseconds()),
        ip: "92.168.112.56",
        iduser: 1514187 + parseInt((new Date()).getMilliseconds())
    });
    let update = await db.device.update(country.id, { model: 1514187 + parseInt((new Date()).getMilliseconds()) });
    let newss = await db.device.getDeviceAll();
    let getnews = await db.device.getDevice(country.id);
    let getDeviceUser = await db.device.getDeviceUser(country.iduser);
    let delet = await db.device.delete(country.id);

    console.log(newss, country, update, getnews, delet, getDeviceUser);
    db.close();
}
async function testDocument() {
    const db = await require('./MySqlModule/main');

    let country = await db.document.addDocument({
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        type: "passport",
        img_url: "http://s" + parseInt((new Date()).getMilliseconds()) + ".jpg",
        iduser: 1514187 + parseInt((new Date()).getMilliseconds())
    });
    let update = await db.document.update(country.id, { img_url: 1514187 + parseInt((new Date()).getMilliseconds()) });
    let newss = await db.document.getDocumentAll();
    let getnews = await db.document.getDocument(country.id);
    let getDocumentUser = await db.document.getDocumentUser(country.iduser);
    let delet = await db.document.delete(country.id);

    console.log(newss, country, update, getnews, delet, getDocumentUser);
    db.close();
}

// testUser(); //
// testUserErr();
// testNews();
// testCountry();
// testPayments();
// testCard();
// testCardHasUser();
// testPartner();
// testRole();
// testDevice();
// testDocument();

const json = require('./JsonModule/main');

json();