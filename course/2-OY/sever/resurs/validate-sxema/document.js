const Joi = require('joi');

// img_url: Joi.string().min(3).max(150),
// img_url: Joi.string().min(3).max(150).required(),
function Validate(xabar, method) {
    const sxema1 = Joi.object({
        type: Joi.string().min(1).max(30).required(),
        iduser: Joi.number().required()
    });
    const sxema2 = Joi.object({
        type: Joi.string().min(1).max(30),
        iduser: Joi.number()
    });

    if (method == 'add')
        return sxema1.validate(xabar);


    return sxema2.validate(xabar);
}

module.exports = Validate;