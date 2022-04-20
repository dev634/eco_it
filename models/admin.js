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

async function getAdmin(payload) {
  let request =
    "SELECT id,pseudo ,email, password FROM users RIGHT JOIN administrators ON users.id = administrators.admin_id WHERE email = $1";
  try {
    let result = await pool.query(request, [payload.email]);
    return result.rows[0];
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
      return { userId: resultOne.rows[0].id };
    }
  } catch (error) {
    throw {
      status: 500,
      message: "Something wrong",
    };
  }
}

async function update(payload) {
  let requestOne = "UPDATE users SET email = $1, password = $2 WHERE id = $3";
  let requestTwo = "UPDATE administrators SET pseudo = $1 WHERE admin_id = $2";
  try {
    await pool.query(requestOne, [payload.email, payload.password, payload.id]);
    await pool.query(requestTwo, [payload.pseudo, payload.id]);
    return {
      status: 200,
      message: "Updated successfully",
    };
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
  getAdmin,
  update,
};
