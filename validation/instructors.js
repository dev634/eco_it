const Joi = require("joi");

module.exports.search = Joi.object({
  firstname: Joi.string()
    .required()
    .min(1)
    .max(10)
    .pattern(/^[a-zA-Z]+$/),
  lastname: Joi.string()
    .required()
    .min(1)
    .max(10)
    .pattern(/^[a-zA-Z]+$/),
  orderby: Joi.string()
    .pattern(/^(firstname)|(lastname)$/)
    .allow(""),
  limit: Joi.string().allow(""),
  page: Joi.string().allow(""),
});
