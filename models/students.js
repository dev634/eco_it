const pool = require("../Services/db");

async function getAll() {
  let request = "SELECT * FROM Students";
  try {
    let result = await pool.query(request);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAll,
};
