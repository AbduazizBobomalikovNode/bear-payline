const Joi = require('joi');

function Validate(xabar, method) {
    const sxema1 = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        content: Joi.string().min(1).max(250).required()
    });
    const sxema2 = Joi.object({
        title: Joi.string().min(3).max(50),
        content: Joi.string().min(1).max(250)
    });

    if (method == 'add')
        return sxema1.validate(xabar);

    return sxema2.validate(xabar);
}

module.exports = Validate;