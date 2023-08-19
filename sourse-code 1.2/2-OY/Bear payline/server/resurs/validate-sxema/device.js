const Joi = require('joi');

function Validate(xabar, method) {
    const sxema1 = Joi.object({
        date: Joi.string().min(3).max(30).required(),
        model: Joi.string().min(3).max(70).required(),
        ip: Joi.string().min(3).max(80).required(),
        iduser: Joi.number().required()
    });
    const sxema2 = Joi.object({
        date: Joi.string().min(3).max(50),
        model: Joi.string().min(9).max(30),
        ip: Joi.string().min(3).max(80),
        iduser: Joi.number()
    });

    if (method == 'add')
        return sxema1.validate(xabar);


    return sxema2.validate(xabar);
}

module.exports = Validate;