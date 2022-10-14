const pool = require("../Services/db");
const { makeDbErrors } = require("../helpers/errors");

async function getTokens(payload) {
  const request = "SELECT * FROM Tokens WHERE id = $1";
  try {
    const result = await pool.query(request, [payload.id]);
  } catch (error) {
    makeDbErrors(error);
  }
}

async function getToken(payload) {
  const request = "SELECT * FROM Tokens WHERE id = $1 AND ";
  try {
    const result = await pool.query(request, [payload.token_id, payload.id]);
    return result;
  } catch (error) {
    makeDbErrors(error);
  }
}

async function setToken(payload) {
  const request = "INSERT INTO Tokens(id, token) VALUES($1, $2)";
  try {
    const result = await pool.query(request, [payload.id, payload.token]);
    return result;
  } catch (error) {
    makeDbErrors(error);
  }
}

async function updateToken(payload) {
  const getRequest = "SELECT * FROM Tokens WHERE id = $1 AND token = $2";
  const updateRequest = "UPDATE Tokens SET token = $1 WHERE id = $2";
  try {
    const resultGetRequest = await pool.query(getRequest, [payload.id, payload.token]);
    const resultUpdateRequest = await pool.query(updateRequest, [resultGetRequest.rows.token_id]);
  } catch (error) {
    makeDbErrors(error);
  }
}

async function deleteToken(payload) {
  const request = "DELETE FROM Tokens WHERE token_id = $1";
  try {
    const result = pool.query(request, [payload.id]);
  } catch (error) {
    makeDbErrors(error);
  }
}
