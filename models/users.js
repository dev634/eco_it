const pool = require("../Services/db");
const { makeDbErrors } = require("../helpers/errors");
const { capitalize } = require("../helpers/strings");
const Logger = require("../Services/logger");

async function getUserBy(payload, error) {
  try {
    let userRequest = "SELECT ";
    const fieldsRequest = "SELECT * FROM users WHERE false";
    const fieldsResult = await pool.query(fieldsRequest);
    const fieldsList = fieldsResult.fields.map((elmt) => elmt.name);

    if (!payload) {
      if (error) {
        throw error;
      }

      throw {
        status: 500,
        message: "Something wrong with the payload",
      };
    }

    if (!fieldsList.includesAll(Object.keys(payload))) {
      if (error) {
        throw error;
      }

      throw {
        status: 500,
        message: "Something wrong with the payload",
      };
    }

    const values = Object.values(payload);
    userRequest += Object.keys(payload).toString() + " ";
    userRequest += "FROM users WHERE ";

    Object.keys(payload).map((elmt, idx) => {
      if (idx === Object.keys(payload).length - 1) {
        userRequest += `${elmt} = $${idx + 1}`;
        return;
      }
      userRequest += `${elmt} = $${idx + 1} AND`;
    });
    const result = await pool.query(userRequest, values);
    return result.rows;
  } catch (error) {
    Logger(error);
    makeDbErrors(error);
  }
}

module.exports = {
  getUserBy,
};
