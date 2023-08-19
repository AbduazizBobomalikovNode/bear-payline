var MongoDb = require('./MongoDbModule/main');
var SqlDb = require('./MySqlModule/main');
var CloudData = require('./CloudModule/main');


class Db {
    constructor() {
        this.buffer = (async function() {
            SqlDb = await SqlDb;
            MongoDb = await MongoDb;
            return {
                cheks: {
                    getCheks: async function(id) {
                        return await MongoDb.cheks.getCheks(id);
                    },
                    addCheks: async function(chek) {
                        return await MongoDb.cheks.addCheks(chek);
                    },
                    delete: async function(id) {
                        return await MongoDb.cheks.delete(id);
                    }
                },
                message: {
                    getMessageForObj: async function(obj) {
                        return await MongoDb.message.getMessageForObj(obj);
                    },
                    getMessage: async function(id) {
                        return await MongoDb.message.getMessage(id);
                    },
                    getMessageForTo: async function(id) {
                        return await MongoDb.message.getMessageForTo(id);
                    },
                    getMessageForFrom: async function(id) {
                        return await MongoDb.message.getMessageForFrom(id);
                    },
                    getMessageAll: async function() {
                        return await MongoDb.message.getMessageAll();
                    },
                    addMessage: async function(adddata) {
                        let result = await SqlDb.message.addMessage(adddata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.message.addMessage(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.message.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.message.update(id, updatedata);
                    },
                    delete: async function(id) {
                        SqlDb.message.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.message.delete(id);
                    }
                },
                user: {
                    getUserForObj: async function(obj) {
                        //SqlDb.user.getUser(id);
                        return await MongoDb.user.getUserForObj(obj);
                    },
                    getUser: async function(id) {
                        //SqlDb.user.getUser(id);
                        return await MongoDb.user.getUser(id);
                    },
                    getUserRole: async function(id) {
                        // SqlDb.user.getUserRole(id);
                        return await MongoDb.user.getUserRole(id);
                    },
                    getUserCountry: async function(id) {
                        //SqlDb.user.getUserCountry(id);
                        return await MongoDb.user.getUserCountry(id);
                    },
                    getUserAll: async function() {
                        // SqlDb.user.getUserAll();
                        return await MongoDb.user.getUserAll();
                    },
                    addUser: async function(adddata) {
                        let result = await SqlDb.user.addUser(adddata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.user.addUser(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.user.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.user.update(id, updatedata);
                    },
                    delete: async function(id) {
                        let result = SqlDb.user.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.user.delete(id);
                    }
                },
                news: {
                    getNews: async function(id) {
                        //SqlDb.news.getNews(id);
                        return await MongoDb.news.getNews(id);
                    },
                    getNewsAll: async function() {
                        //SqlDb.news.getNewsAll();
                        return await MongoDb.news.getNewsAll();
                    },
                    addNews: async function(adddata) {
                        let result = await SqlDb.news.addNews(adddata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.news.addNews(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.news.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.news.update(id, updatedata);
                    },
                    delete: async function(id) {
                        let result = SqlDb.news.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.news.delete(id);
                    }
                },
                country: {
                    getCountryForObj: async function(obj) {
                        //SqlDb.country.getCountry(id);
                        return await MongoDb.country.getCountryForObj(obj);
                    },
                    getCountry: async function(id) {
                        //SqlDb.country.getCountry(id);
                        return await MongoDb.country.getCountry(id);
                    },
                    getCountryAll: async function() {
                        //SqlDb.country.getCountryAll();
                        return await MongoDb.country.getCountryAll();
                    },
                    addCountry: async function(adddata) {
                        let result = await SqlDb.country.addCountry(adddata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.country.addCountry(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.country.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.country.update(id, updatedata);
                    },
                    delete: async function(id) {
                        let result = SqlDb.country.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.country.delete(id);
                    }
                },
                payments: {
                    getPayments: async function(id) {
                        //SqlDb.payments.getPayments(id);
                        return await MongoDb.payments.getPayments(id);
                    },
                    getPaymentsUser: async function(id) {
                        //SqlDb.payments.getPaymentsUser(id);
                        return await MongoDb.payments.getPaymentsUser(id);
                    },
                    getPaymentsAll: async function() {
                        //SqlDb.payments.getPaymentsAll();
                        return await MongoDb.payments.getPaymentsAll();
                    },
                    addPayments: async function(adddata) {
                        let result = await SqlDb.payments.addPayments(adddata);
                        // console.log(result, typeof result, result);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.payments.addPayments(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.payments.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.payments.update(id, updatedata);
                    },
                    delete: async function(id) {
                        let result = SqlDb.payments.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.payments.delete(id);
                    }
                },
                card: {
                    getCard: async function(id) {
                        //SqlDb.card.getCard(id);
                        return await MongoDb.card.getCard(id);
                    },
                    getCardAll: async function() {
                        //SqlDb.card.getCardAll();
                        return await MongoDb.card.getCardAll();
                    },
                    addCard: async function(adddata) {
                        let result = await SqlDb.card.addCard(adddata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.card.addCard(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.card.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.card.update(id, updatedata);
                    },
                    delete: async function(id) {
                        let result = SqlDb.card.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.card.delete(id);
                    }
                },
                cardHasUser: {
                    getCardHasUser: async function(id) {
                        //SqlDb.cardHasUser.getCardHasUser(id);
                        return await MongoDb.cardHasUser.getCardHasUser(id);
                    },
                    getCardHasUserForCard: async function(id) {
                        //SqlDb.cardHasUser.getCardHasUserForCard(id);
                        return await MongoDb.cardHasUser.getCardHasUserForCard(id);
                    },
                    getCardHasUserForUser: async function(id) {
                        //SqlDb.cardHasUser.getCardHasUserForUser(id);
                        return await MongoDb.cardHasUser.getCardHasUserForUser(id);
                    },
                    getCardHasUserAll: async function() {
                        //SqlDb.cardHasUser.getCardHasUserAll();
                        return await MongoDb.cardHasUser.getCardHasUserAll();
                    },
                    addCardHasUser: async function(adddata) {
                        let result = await SqlDb.cardHasUser.addCardHasUser(adddata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.cardHasUser.addCardHasUser(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.cardHasUser.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.cardHasUser.update(id, updatedata);
                    },
                    delete: async function(id) {
                        let result = SqlDb.cardHasUser.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.cardHasUser.delete(id);
                    }
                },
                partner: {
                    getPartner: async function(id) {
                        //SqlDb.partner.getPartner(id);
                        return await MongoDb.partner.getPartner(id);
                    },
                    getPartnerUser: async function(id) {
                        //SqlDb.partner.getPartnerUser(id);
                        return await MongoDb.partner.getPartnerUser(id);
                    },
                    getPartnerAll: async function() {
                        //SqlDb.partner.getPartnerAll();
                        return await MongoDb.partner.getPartnerAll();
                    },
                    addPartner: async function(adddata) {
                        let result = await SqlDb.partner.addPartner(adddata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.partner.addPartner(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.partner.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.partner.update(id, updatedata);
                    },
                    delete: async function(id) {
                        let result = SqlDb.partner.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.partner.delete(id);
                    }
                },
                role: {
                    getRoleForObj: async function(obj) {
                        //SqlDb.role.getRole(id);
                        return await MongoDb.role.getRoleForObj(obj);
                    },
                    getRole: async function(id) {
                        //SqlDb.role.getRole(id);
                        return await MongoDb.role.getRole(id);
                    },
                    getRoleAll: async function() {
                        //SqlDb.role.getRoleAll();
                        return await MongoDb.role.getRoleAll();
                    },
                    addRole: async function(adddata) {
                        let result = await SqlDb.role.addRole(adddata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.role.addRole(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.role.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.role.update(id, updatedata);
                    },
                    delete: async function(id) {
                        let result = SqlDb.role.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.role.delete(id);
                    }
                },
                device: {
                    getDevice: async function(id) {
                        //SqlDb.device.getDevice(id);
                        return await MongoDb.device.getDevice(id);
                    },
                    getDeviceUser: async function(id) {
                        //SqlDb.device.getDeviceUser(id);
                        return await MongoDb.device.getDeviceUser(id);
                    },
                    getDeviceAll: async function() {
                        //SqlDb.device.getDeviceAll();
                        return await MongoDb.device.getDeviceAll();
                    },
                    addDevice: async function(adddata) {
                        let result = await SqlDb.device.addDevice(adddata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.device.addDevice(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.device.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.device.update(id, updatedata);
                    },
                    delete: async function(id) {
                        let result = SqlDb.device.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.device.delete(id);
                    }
                },
                document: {
                    getDocument: async function(id) {
                        //SqlDb.document.getDocument(id);
                        return await MongoDb.document.getDocument(id);
                    },
                    getDocumentUser: async function(id) {
                        //SqlDb.document.getDocumentUser(id);
                        return await MongoDb.document.getDocumentUser(id);
                    },
                    getDocumentAll: async function() {
                        //SqlDb.document.getDocumentAll();
                        return await MongoDb.document.getDocumentAll();
                    },
                    addDocument: async function(adddata) {
                        let result = await SqlDb.document.addDocument(adddata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.document.addDocument(adddata);
                    },
                    update: async function(id, updatedata) {
                        let result = await SqlDb.document.update(id, updatedata);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.document.update(id, updatedata);
                    },
                    delete: async function(id) {
                        let result = SqlDb.document.delete(id);
                        if (result.hasOwnProperty('error')) {
                            return result;
                        }
                        return await MongoDb.document.delete(id);
                    }
                },
                cloud: CloudData,
                close: function() {
                    MongoDb.close();
                    SqlDb.close();
                }
            }
        })();
    }
    async Main() {

        return this.buffer;
    }
}
module.exports = new Db().Main();