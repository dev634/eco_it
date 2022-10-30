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
    let result = await Database.getBy(payload, "users", ["id", "pseudo", "email"], null);
    return result;
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function create(payload) {
  const requestOne =
    "INSERT INTO users(email,password, role, pseudo) VALUES($1,$2,$3,$4) RETURNING id";

  try {
    const resultOne = await pool.query(requestOne, [
      payload.email,
      payload.password,
      payload.role,
      payload.username,
    ]);
    return {
      userId: resultOne.rows[0].id,
      username: resultOne.rows[0].pseudo,
    };
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function update(payload) {
  let requestOne = "UPDATE users SET email = $1, password = $2 WHERE id = $3";
  let requestTwo = "UPDATE administrators SET pseudo = $1 WHERE id = $2";
  try {
    await pool.query(requestOne, [payload.email, payload.password, payload.id]);
    await pool.query(requestTwo, [payload.pseudo, payload.id]);
    return {
      status: 200,
      message: "Updated successfully",
    };
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
};
