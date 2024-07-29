const Joi = require("joi");

module.exports.donationSchema = Joi.object({
    donation: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone_no: Joi.number().required(),
    }).required()
});