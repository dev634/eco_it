const pool = require("../Services/db");
const { makeDbErrors } = require("../helpers/errors");
const { capitalize } = require("../helpers/strings");
const Logger = require("../Services/logger");
const dbCredentials = require("../constantes/dbCredentials");
const Database = require("../Services/database");
Database.init(dbCredentials, "users", Logger, null, "public");

async function getUserBy(payload, error) {
  try {
    const result = await Database.getBy(payload, "users");
    return result;
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

module.exports = {
  getUserBy,
};
