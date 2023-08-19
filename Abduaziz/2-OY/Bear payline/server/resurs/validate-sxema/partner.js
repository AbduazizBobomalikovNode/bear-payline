const Joi = require('joi');

function Validate(xabar, method) {
    const sxema1 = Joi.object({
        card_number: Joi.string().min(12).max(30).required(),
        name: Joi.string().min(3).max(50).required(),
        iduser: Joi.number().required()
    });
    const sxema2 = Joi.object({
        card_number: Joi.string().min(12).max(30),
        name: Joi.string().min(3).max(50),
        iduser: Joi.number()
    });

    if (method == 'add')
        return sxema1.validate(xabar);


    return sxema2.validate(xabar);
}

module.exports = Validate;