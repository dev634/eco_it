const pool = require("../Services/db");
const Logger = require("../Services/logger");
const { makeDbErrors } = require("../helpers/errors");

async function getUser(id) {
  try {
    const requestOne = `SELECT * FROM users JOIN administrators ON users.id = administrators.id WHERE users.id = $1`;
    const requestTwo = `SELECT * FROM users JOIN instructors ON users.id = instructors.id WHERE users.id = $1`;
    const requestThree = `SELECT * FROM users JOIN students ON users.id = students.id WHERE users.id = $1`;
    const resultOne = await pool.query(requestOne, [id]);
    const resultTwo = await pool.query(requestTwo, [id]);
    const resultThree = await pool.query(requestThree, [id]);
    let result = { rows: [...resultOne.rows, ...resultTwo.rows, ...resultThree.rows] };
    return result.rows[0];
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

async function updateUser(payload) {
  try {
    let requestOne = "";
    let requestTwo = "";
    let result = "";
    if (payload.role === "administrator") {
      requestOne = `UPDATE users SET email = $2, password = $3 WHERE users.id = $1`;
      requestTwo = `UPDATE administrators SET pseudo = $2, role = $3 WHERE administrators.id = $1`;
      await pool.query(requestOne, [payload.id, payload.email, payload.password]);
      await pool.query(requestTwo, [payload.id, payload.role]);
    }

    if (payload.role === "instructor") {
      requestOne = `UPDATE users SET email = $2, password = $3 WHERE users.id = $1`;
      requestTwo = `UPDATE instructors SET firstname = $2, lastname = $3, photo = $4, isApprouved = $5, description = $6, role = $7 WHERE instructors.id = $1`;
      await pool.query(requestOne, [payload.id, payload.password]);
      await pool.query(requestTwo, [
        payload.id,
        payload.firstname,
        payload.lastname,
        payload.photo,
        payload.isApprouved,
        payload.description,
        payload.role,
      ]);
    }

    if (payload.role === "student") {
      requestOne = `UPDATE users SET email = $2, password = $3 WHERE users.id = $1`;
      requestTwo = `UPDATE students SET pseudo = $2, role = $3 WHERE students.id = $1`;
      await pool.query(requestOne, [id, payload.email]);
      await pool.query(requestTwo, [id, payload.pseudo]);
    }

    const result = await getUser(payload.id);
    return result.rows[0];
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

module.exports = {
  getUser,
};
