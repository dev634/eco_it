const { makeDbErrors } = require("../helpers/errors");
const Logger = require("../Services/logger");
const dbCredentials = require("../constantes/dbCredentials");
const Database = require("../Services/database");
Database.init(dbCredentials, "users", Logger, null, "public");

async function getUser(payload, responseFields, settings) {
  try {
    let result = await Database.getBy(payload, "users", responseFields, null, settings);
    return result;
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function getUsers(payload, responseFields, all, sensitive, settings) {
  if (payload.role) {
    delete payload.role;
  }
  let newPayload = { ...payload };
  try {
    Object.keys(payload).map((field) => {
      newPayload[field] = { sensitive, value: payload[field] };
    });

    let result = await Database.find("users", newPayload, responseFields, all, null, {
      ...settings,
    });
    return result;
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

module.exports = {
  getUser,
  getUsers,
};
