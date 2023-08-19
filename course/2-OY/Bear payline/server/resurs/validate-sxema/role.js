const Joi = require('joi');

function Validate(xabar, method) {
    const sxema1 = Joi.object({
        role: Joi.string().min(1).max(50).required(),
        licence: Joi.string().min(2).max(150).required()
    });
    const sxema2 = Joi.object({
        role: Joi.string().min(1).max(50),
        licence: Joi.string().min(2).max(150)
    });

    if (method == 'add')
        return sxema1.validate(xabar);


    return sxema2.validate(xabar);
}

module.exports = Validate;