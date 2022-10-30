const { makeDbErrors } = require("../helpers/errors");
const Logger = require("../Services/logger");
const dbCredentials = require("../constantes/dbCredentials");
const Database = require("../Services/database");
Database.init(dbCredentials, "users", Logger, null, "public");

async function getUser(payload, responseFields) {
  try {
    let result = await Database.getBy(payload, "users", responseFields);
    return result;
  } catch (error) {
    Logger(error);
    makeDberrors(error);
  }
}

module.exports = {
  getUser,
};
