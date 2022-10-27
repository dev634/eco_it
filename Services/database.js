const dotenv = require("dotenv");
const { Pool } = require("pg");
dotenv.config();

function Database(credentials) {
  let pool = "";
  return pool;
}

Database.init = function (credentials) {
  this.pool = new Pool({ ...credentials });
};

Database.getBy = async function (payload, table, error) {
  try {
    const pool = new Database();
    const result = await this.pool.query(`SELECT * FROM ${table}`);
    return result.rows;
  } catch (err) {
    if (error) {
      throw error;
    }
  }
};

Database.update = async function (payload, table, error) {
  const pool = new Database();
};

Database.delete = async function (payload, table, error) {
  const pool = new Database();
};

Database.deleteBy = async function (payload, table, error) {
  // Delete One or Many Rows Return the deleted rows
  const pool = new Database();
};

module.exports = Database;
