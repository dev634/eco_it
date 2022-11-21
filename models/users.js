const { makeDbErrors } = require("../helpers/errors");
const Logger = require("../Services/logger");
const dbCredentials = require("../constantes/dbCredentials");
const Database = require("../Services/database");
Database.init(dbCredentials, "users", Logger, null, "public");

async function getUser(payload, responseFields) {
  try {
    console.log(payload);
    let result = await Database.getBy(payload, "users", responseFields, null);
    return result;
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function getUsers(payload, responseFields) {
  if (payload.role) {
    delete payload.role;
  }
  let newPayload = { ...payload };
  try {
    Object.keys(payload).map((field) => {
      newPayload[field] = { sensitive: true, value: payload[field] };
    });

    let result = await Database.find("users", newPayload, responseFields, false, null);
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
