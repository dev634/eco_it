const dotenv = require("dotenv");
dotenv.config();

function displayError(error) {
  return console.log(error);
}

module.exports.errorsHandler = function (error) {
  if (error.isJoi) {
    const details = { ...error.details[0] };
    if (details.type === "string.pattern.base") {
      return res.status(400).json({
        status: 400,
        message: `${error.details[0].path[0]} invalid.`,
      });
    }
    return res.status(400).json({
      status: 400,
      message: details.message,
    });
  }

  return res.status(error.status).json(error);
};

module.exports.makeDbErrors = function (error, logger) {
  if (["dev", "development"].includes(process.env.NODE_ENV)) {
    displayError(error);
  }

  if (["prod", "production"].includes(process.env.NODE_ENV) && logger) {
    logger(
      `Code : ${error.code} | Detail : ${error.detail} | Table : ${error.table} | Constraint : ${error.constraint}`
    );
  }

  if (error.code === "23505") {
    throw {
      status: 409,
      message: "This user already exists",
    };
  }

  throw {
    status: 500,
    message: "Something went wrong ",
  };
};
