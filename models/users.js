const pool = require("../Services/db");
const { makeDbErrors } = require("../helpers/errors");
const { capitalize } = require("../helpers/strings");

async function getUser(id, type) {
  const request = `SELECT * FROM users AS u JOIN ${capitalize(
    type
  )}s AS a ON u.id = a.id WHERE $1 = u.id`;

  try {
    const result = await pool.query(request, [id]);
    return result.rows[0];
  } catch (error) {
    makeDbErrors(error);
  }
}

module.exports = {
  getUser,
};
