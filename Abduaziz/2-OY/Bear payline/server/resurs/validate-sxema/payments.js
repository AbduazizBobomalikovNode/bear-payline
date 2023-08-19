const Joi = require('joi');

function Validate(xabar, method) {
    const sxema1 = Joi.object({
        iduser: Joi.number().required(),
        date: Joi.string().min(2).max(40).required(),
        sender_card_number: Joi.string().min(12).max(30).required(),
        amout: Joi.number().required(),
        currency: Joi.string().min(2).max(5).required(),
        receiver_card_number: Joi.string().min(12).max(30).required(),
        receiver_full_name: Joi.string().min(3).max(50).required(),
        commission: Joi.number().required(),
        method: Joi.string().max(150).required(),
    });
    const sxema2 = Joi.object({
        iduser: Joi.number(),
        date: Joi.string().min(2).max(40),
        sender_card_number: Joi.string().min(12).max(30),
        amout: Joi.number(),
        currency: Joi.string().min(2).max(5),
        receiver_card_number: Joi.string().min(12).max(30),
        receiver_full_name: Joi.string().min(3).max(50),
        commission: Joi.number(),
        method: Joi.string(),
    });

    if (method == 'add')
        return sxema1.validate(xabar);


    return sxema2.validate(xabar);
}

module.exports = Validate;