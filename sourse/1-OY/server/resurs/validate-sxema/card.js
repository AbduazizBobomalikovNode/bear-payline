const Joi = require('joi');

function Validate(xabar, method) {
    const sxema1 = Joi.object({
        number: Joi.string().min(12).max(30).required(),
        full_name: Joi.string().min(3).max(50).required(),
        date: Joi.string().max(3).max(20).required(),
        cvv: Joi.string().max(3).required(),
    });
    const sxema2 = Joi.object({
        number: Joi.string().min(12).max(30),
        full_name: Joi.string().min(3).max(50),
        date: Joi.string().max(3).max(20),
        cvv: Joi.string().max(3),
    });

    if (method == 'add')
        return sxema1.validate(xabar);


    return sxema2.validate(xabar);
}

module.exports = Validate;