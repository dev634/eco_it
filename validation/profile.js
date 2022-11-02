const Joi = require("joi");

module.exports.update = Joi.object({
  pseudo: Joi.string()
    .required()
    .min(3)
    .max(32)
    .pattern(/^[a-zA-Z-_\s]+$/),
  email: Joi.string()
    .required()
    .pattern(
      /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    ),
  password: Joi.string()
    .required()
    .min(6)
    .max(16)
    .pattern(/^[a-zA-Z0-9]+$/),
  password_confirm: Joi.ref("password"),
});
