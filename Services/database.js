const dotenv = require("dotenv");
const { Pool } = require("pg");
dotenv.config();

function Database() {
  let pool = null;
  let table = null;
  let tablesList = null;
  let fields = [];
  let logger = null;
  let makeDbErrors = null;
  return pool;
}

Database.init = async function (credentials, table, logger, makeDbErrors, schema) {
  // initialize the database query builder
  let tablesRequest = `SELECT * FROM information_schema.tables WHERE table_schema = '${schema}'`;
  let fieldsRequest = `SELECT * FROM ${table} WHERE false`;
  let fieldsResult = null;
  let tablesResult = null;
  this.logger = logger;
  this.makeDbErrors = makeDbErrors;
  this.pool = new Pool({ ...credentials });
  this.table = table;
  tablesResult = await this.pool.query(tablesRequest);
  this.tablesList = tablesResult.rows.map((elmt) => elmt.table_name);
  fieldsResult = await this.pool.query(fieldsRequest);
  this.fields = fieldsResult.fields.map((elmt) => elmt.name);
};

Database.getBy = async function (payload, table, error) {
  console.log(payload);
  try {
    let userRequest = "SELECT ";

    // test if all the payload are here
    if (!payload) {
      if (error) {
        throw error;
      }

      throw {
        status: 500,
        message: "The payload object is required",
      };
    }

    // test if all the table are here
    if (!table) {
      if (error) {
        throw error;
      }

      throw {
        status: 500,
        message: "The table argument is required",
      };
    }

    // compare if the table does exists in the database
    if (!this.tablesList.includes(table)) {
      if (error) {
        throw error;
      }

      throw {
        status: 500,
        message: "This table doesn't exists in the database",
      };
    }

    // compare the payload property names with the fields of a given table
    if (!this.fields.includesAll(Object.keys(payload))) {
      if (error) {
        throw error;
      }

      throw {
        status: 500,
        message: "Something wrong with the payload and the fields",
      };
    }

    // get an array of values from the payload
    const values = Object.values(payload);

    // build the string request
    userRequest += Object.keys(payload).toString() + " ";
    userRequest += "FROM users WHERE ";

    Object.keys(payload).map((elmt, idx) => {
      if (idx === Object.keys(payload).length - 1) {
        userRequest += `${elmt} = $${idx + 1}`;
        return;
      }
      userRequest += `${elmt} = $${idx + 1} AND `;
    });

    const result = await this.pool.query(userRequest, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Database.create = async function () {};

Database.update = async function (payload, table, error) {};

Database.delete = async function (payload, table, error) {};

module.exports = Database;
