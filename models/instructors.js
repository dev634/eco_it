const pool = require("../Services/db");

async function getAll() {
  let request = "SELECT * FROM Instructors";
  try {
    let result = await pool.query(request);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function getById(id) {
  let request = "SELECT * FROM Users, Instructors WHERE instructor_id = $1 AND id = $1";
  try {
    let result = await pool.query(request, [id]);
    return result.rows;
  } catch (error) {
    console.log("Model ", error);
    throw {
      status: 500,
      message: "Something wrong",
    };
  }
}

module.exports = {
  getAll,
  getById,
};
