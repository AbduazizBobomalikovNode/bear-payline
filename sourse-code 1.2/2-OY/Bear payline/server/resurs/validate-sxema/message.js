const Joi = require('joi');

function Validate(xabar, method) {
    const sxema1 = Joi.object({
        to_user: Joi.number().required(),
        from_user: Joi.number().required(),
        text: Joi.string().min(1).max(2000).required(),
        is_read: Joi.boolean().required(),
        date: Joi.string().min(4).max(40).required(),
        reply_message: Joi.number(),
        is_reply: Joi.boolean().required()
    });
    const sxema2 = Joi.object({
        to_user: Joi.number(),
        from_user: Joi.number(),
        text: Joi.string().min(1).max(2000),
        is_read: Joi.boolean(),
        date: Joi.string().min(4).max(40),
        reply_message: Joi.number(),
        is_reply: Joi.boolean()
    });

    if (method == 'add')
        return sxema1.validate(xabar);


    return sxema2.validate(xabar);
}

module.exports = Validate;