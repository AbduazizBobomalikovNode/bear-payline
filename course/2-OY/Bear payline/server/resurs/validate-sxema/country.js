const Joi = require('joi');

function Validate(xabar, method) {
    const sxema1 = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        code: Joi.string().min(1).max(5).required(),
        phone_code: Joi.string().min(1).max(5).required(),
        lang_arr: Joi.string().min(1).max(50).required(),
        currency: Joi.string().min(1).max(5).required(),
        commission: Joi.number().required(),
    });
    const sxema2 = Joi.object({
        name: Joi.string().min(3).max(50),
        code: Joi.string().min(1).max(5),
        phone_code: Joi.string().min(1).max(5),
        lang_arr: Joi.string().min(1).max(50),
        currency: Joi.string().min(1).max(5),
        commission: Joi.number(),
    });

    if (method == 'add')
        return sxema1.validate(xabar);


    return sxema2.validate(xabar);
}

module.exports = Validate;