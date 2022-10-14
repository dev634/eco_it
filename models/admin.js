const pool = require("../Services/db");
const { makeDbErrors } = require("../helpers/errors");
const { exists } = require("../Services/files");
const Logger = require("../Services/logger");

async function checkAdmin() {
  let request = "SELECT * FROM Administrators";
  try {
    let result = await pool.query(request);
    return !!result.rows[0];
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function getAdmin(payload) {
  let request =
    "SELECT u.id, pseudo , email, password FROM Users AS u RIGHT JOIN Administrators AS a ON u.id = a.id WHERE email = $1";
  try {
    let result = await pool.query(request, [payload.email]);
    return result.rows[0];
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function create(payload) {
  const requestOne = "INSERT INTO users(email,password) VALUES($1,$2) RETURNING id";
  const requestTwo = "INSERT INTO administrators(id, pseudo) VALUES($1,$2) RETURNING pseudo";

  try {
    const resultOne = await pool.query(requestOne, [payload.email, payload.password]);
    if (resultOne.rowCount > 0) {
      const resultTwo = await pool.query(requestTwo, [resultOne.rows[0].id, payload.username]);
      return {
        userId: resultOne.rows[0].id,
        username: resultTwo.rows[0].pseudo,
      };
    }
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
