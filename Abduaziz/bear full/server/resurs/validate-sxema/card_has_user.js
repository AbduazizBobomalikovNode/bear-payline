const Joi = require('joi');

function Validate(xabar, method) {
    const sxema1 = Joi.object({
        idcard: Joi.number().required(),
        iduser: Joi.number().required()
    });
    const sxema2 = Joi.object({
        idcard: Joi.number(),
        iduser: Joi.number()
    });

    if (method == 'add')
        return sxema1.validate(xabar);
        
    return sxema2.validate(xabar);
}

module.exports = Validate;