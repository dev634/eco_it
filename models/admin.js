const pool = require("../Services/db");

async function checkAdmin() {
  let request = "SELECT * FROM Administrators";
  try {
    let result = await pool.query(request);
    return !!result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function create(payload) {
  let requestOne = "INSERT INTO users(email,password) VALUES($1,$2) RETURNING id";
  let requestTwo = "INSERT INTO administrators(admin_id, pseudo) VALUES($1,$2) RETURNING pseudo";
  try {
    let resultOne = await pool.query(requestOne, [payload.email, payload.password]);
    if (resultOne.rowCount > 0) {
      let resultTwo = await pool.query(requestTwo, [resultOne.rows[0].id, payload.username]);
      return {
        status: 201,
        message: "Created successfully",
      };
    }
  } catch (error) {
    throw {
      status: 500,
      message: "Something wrong",
    };
  }
}

module.exports = {
  checkAdmin,
  create,
};
