const Joi = require("joi");
const { PAGE, LIMIT, ORDERBY, INSTRUCTORS_ORDERBY_ALLOWED } = require("../constantes/default");

module.exports.query = Joi.object({
  orderby: Joi.string()
    .empty("")
    .default(ORDERBY)
    .valid(
      INSTRUCTORS_ORDERBY_ALLOWED[0],
      INSTRUCTORS_ORDERBY_ALLOWED[1],
      INSTRUCTORS_ORDERBY_ALLOWED[2]
    ),
  page: Joi.string().empty("").default(PAGE),
  limit: Joi.string().empty("").default(LIMIT),
  action: Joi.string().valid("prev", "next").empty("").default("none"),
});
