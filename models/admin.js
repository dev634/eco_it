let pool = require("../Services/db");

async function checkAdmin() {
  let request = "SELECT * FROM Administrators";
  try {
    let result = await pool.query(request);
    return !!result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function create() {}

module.exports = {
  checkAdmin,
};
