var db = null;
async function testUser() {
    // console.log(db);
    let obj = {
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        full_name: "salom",
        phone: "+9989166643" + parseInt((Math.random() * 100000) % 10000),
        address: "Farg'ona",
        idcountry: 156878787,
        idrole: 4548787
    };
    let user = await db.user.addUser(obj);
    let update = await db.user.update(obj.id, { address: "kurtlar vodiysi" });
    let users = await db.user.getUserAll();
    let getuser = await db.user.getUser(obj.id);
    let getuserRole = await db.user.getUserRole(obj.idrole);
    let getUserCountry = await db.user.getUserCountry(obj.idcountry);
    let delet = await db.user.delete(obj.id);

    console.log(user, users, delet, update, getuser, getuserRole, getUserCountry);

}
async function testNews() {


    //console.log(db);
    let obj = {
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        title: "salom",
        content: "+9989166643" + parseInt((Math.random() * 100000) % 10000),
        img_url: "Farg'ona"
    };
    let anews = await db.news.addNews(obj);
    let update = await db.news.update(obj.id, { content: "kurtlar vodiysi" });
    let newss = await db.news.getNewsAll();
    let getnews = await db.news.getNews(obj.id);
    let delet = await db.news.delete(obj.id);

    console.log(newss, anews, update, getnews, delet);

}
async function testCountry() {


    //console.log(db);
    let obj = {
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        name: "O'zbekiston",
        code: "" + parseInt((Math.random() * 100000) % 1000),
        phone_code: "+998",
        lang_arr: "[uz,ru,eng]",
        currency: "UZS",
        commission: 2,
    };
    let country = await db.country.addCountry(obj);
    let update = await db.country.update(obj.id, { commission: 3 });
    let newss = await db.country.getCountryAll();
    let getnews = await db.country.getCountry(obj.id);
    let delet = await db.country.delete(obj.id);

    console.log(newss, country, update, getnews, delet);

}
async function testPayments() {


    console.log((new Date()).toISOString().slice(0, 19).replace('T', ' '));
    let obj = {
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
    };
    let country = await db.payments.addPayments(obj);
    let update = await db.payments.update(obj.id, { commission: 7 });
    let newss = await db.payments.getPaymentsAll();
    let getnews = await db.payments.getPayments(obj.id);
    let getPaymentsUser = await db.payments.getPaymentsUser(obj.iduser);
    let delet = await db.payments.delete(obj.id);

    console.log(newss, country, update, getnews, delet, getPaymentsUser);

}
async function testCard() {

    let obj = {
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        number: "86000145457878",
        full_name: "Bobomalikov Abduaziz",
        date: (new Date()).toISOString().slice(0, 19).replace('T', ' ') + "",
        cvv: "123"
    };
    let country = await db.card.addCard(obj);
    let update = await db.card.update(obj.id, { full_name: 7 });
    let newss = await db.card.getCardAll();
    let getnews = await db.card.getCard(obj.id);
    let delet = await db.card.delete(obj.id);

    console.log(newss, country, update, getnews, delet);

}
async function testCardHasUser() {

    let obj = {
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        idcard: 1514187 + parseInt((new Date()).getMilliseconds()),
        iduser: 1514187 + parseInt((new Date()).getMilliseconds())
    };
    let country = await db.cardHasUser.addCardHasUser(obj);
    let update = await db.cardHasUser.update(obj.id, { idcard: 1514187 + parseInt((new Date()).getMilliseconds()) });
    let newss = await db.cardHasUser.getCardHasUserAll();
    let getnews = await db.cardHasUser.getCardHasUser(obj.id);
    let getCardHasUserForUser = await db.cardHasUser.getCardHasUserForUser(getnews.iduser);
    let getCardHasUserForCard = await db.cardHasUser.getCardHasUserForCard(getnews.idcard);
    let delet = await db.cardHasUser.delete(obj.id);

    console.log(newss, country, update, getnews, delet, getCardHasUserForUser, getCardHasUserForCard);

}
async function testPartner() {

    let obj = {
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        card_number: "565989855487",
        name: "Bobomalikov Abduaziz",
        iduser: 1514187 + parseInt((new Date()).getMilliseconds())
    };
    let country = await db.partner.addPartner(obj);
    let update = await db.partner.update(obj.id, { name: 1514187 + parseInt((new Date()).getMilliseconds()) });
    let newss = await db.partner.getPartnerAll();
    let getnews = await db.partner.getPartner(obj.id);
    let getPartnerUser = await db.partner.getPartnerUser(obj.iduser);
    let delet = await db.partner.delete(obj.id);

    console.log(newss, country, update, getnews, delet, getPartnerUser);

}
async function testRole() {

    let obj = {
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        role: "admin" + parseInt((new Date()).getMilliseconds()),
        licence: "Bobomalikov Abduaziz"
    };
    let country = await db.role.addRole(obj);
    let update = await db.role.update(obj.id, { licence: 1514187 + parseInt((new Date()).getMilliseconds()) });
    let newss = await db.role.getRoleAll();
    let getnews = await db.role.getRole(obj.id);
    let delet = await db.role.delete(obj.id);

    console.log(newss, country, update, getnews, delet);

}
async function testDevice() {

    let obj = {
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        date: (new Date()).toISOString().slice(0, 19).replace('T', ' ') + "",
        model: "Redmi s" + parseInt((new Date()).getMilliseconds()),
        ip: "92.168.112.56",
        iduser: 1514187 + parseInt((new Date()).getMilliseconds())
    };
    let country = await db.device.addDevice(obj);
    let update = await db.device.update(obj.id, { model: 1514187 + parseInt((new Date()).getMilliseconds()) });
    let newss = await db.device.getDeviceAll();
    let getnews = await db.device.getDevice(obj.id);
    let getDeviceUser = await db.device.getDeviceUser(obj.iduser);
    let delet = await db.device.delete(obj.id);

    console.log(newss, country, update, getnews, delet, getDeviceUser);

}
async function testDocument() {

    let obj = {
        id: 1514187 + parseInt((new Date()).getMilliseconds()),
        type: "passport",
        img_url: "http://s" + parseInt((new Date()).getMilliseconds()) + ".jpg",
        iduser: 1514187 + parseInt((new Date()).getMilliseconds())
    };
    let country = await db.document.addDocument(obj);
    let update = await db.document.update(obj.id, { img_url: 1514187 + parseInt((new Date()).getMilliseconds()) });
    let newss = await db.document.getDocumentAll();
    let getnews = await db.document.getDocument(obj.id);
    let getDocumentUser = await db.document.getDocumentUser(obj.iduser);
    let delet = await db.document.delete(obj.id);

    console.log(newss, country, update, getnews, delet, getDocumentUser);

}

async function Run() {
    db = await require('./SuperDb/MySqlModule/main');
    await testUser();
    await testNews();
    await testCountry();
    await testPayments();
    await testCard();
    await testCardHasUser();
    await testPartner();
    await testRole();
    await testDevice();
    await testDocument();
    db.close();
}
Run();

// const json = require('./JsonModule/main');

// json();