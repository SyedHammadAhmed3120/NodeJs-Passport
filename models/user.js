var Joi = require('joi');

var user = {
    body: {
        _id: Joi.string().required(),
        password: Joi.string().required(),
        firstname: Joi.string().optional(),
        lastname: Joi.string().optional(),
        email: Joi.string().email().optional()
    }
}

module.exports = user;