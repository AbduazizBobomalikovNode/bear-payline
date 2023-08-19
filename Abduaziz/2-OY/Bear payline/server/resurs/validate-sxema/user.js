const Joi = require('joi');

function Validate(xabar, method) {
    const sxema1 = Joi.object({
        full_name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(9).max(30).required(),
        address: Joi.string().min(3).max(80),
        idrole: Joi.number().required(),
        idcountry: Joi.number().required(),
        email: Joi.string().min(5).max(100),
        email_status: Joi.number(),
        status: Joi.number()
    });
    const sxema2 = Joi.object({
        full_name: Joi.string().min(3).max(50),
        phone: Joi.string().min(9).max(30),
        address: Joi.string().min(3).max(80),
        idrole: Joi.number(),
        idcountry: Joi.number(),
        email: Joi.string().min(5).max(100),
        email_status: Joi.number(),
        status: Joi.number()
    });

    if (method == 'add')
        return sxema1.validate(xabar);


    return sxema2.validate(xabar);
}

module.exports = Validate;