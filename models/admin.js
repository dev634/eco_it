const pool = require("../Services/db");
const { makeDbErrors } = require("../helpers/errors");
const { exists } = require("../Services/files");
const Logger = require("../Services/logger");
const dbCredentials = require("../constantes/dbCredentials");
const Database = require("../Services/database");
Database.init(dbCredentials, "users", Logger, null, "public");

async function checkAdmin() {
  let request = "SELECT * FROM Users WHERE role = $1";
  try {
    let result = await pool.query(request, ["Administrator"]);
    return !!result.rows[0];
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function getAdmin(payload) {
  try {
    let result = await Database.getBy(
      payload,
      "users",
      ["id", "pseudo", "email", "password"],
      null,
      { orderby: "firstname" }
    );
    return result;
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function create(payload) {
  try {
    delete payload.password_confirm;
    const result = await Database.create(payload, "users", ["id", "pseudo"], null);
    return {
      userId: result[0].id,
      username: result[0].pseudo,
    };
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function update(payload) {
  try {
    let result = Database.update(payload, "users", { id: payload.id }, ["id", "pseudo"], null);
    return result;
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function deleteAdmin(payload) {
  try {
    let result = await Database.delete(
      "users",
      { ...payload, role: { op: "=", value: "administrator" } },
      ["pseudo"],
      null
    );
    return result;
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

module.exports = {
  checkAdmin,
  create,
  getAdmin,
  update,
  deleteAdmin,
};
