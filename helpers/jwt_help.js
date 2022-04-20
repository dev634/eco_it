const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function genAccessToken(datas) {
  try {
    const token = await JWT.sign({}, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRE),
      audience: datas.toString(),
    });
    return token;
  } catch (error) {
    throw error;
  }
}

async function verifyAccessToken(token) {
  try {
    let result = await JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function genRefreshToken(datas, options) {
  try {
    const token = await JWT.sign(datas, process.env.JWT_REFRESH_TOKEN_SECRET, options);
    return token;
  } catch (error) {
    throw error;
  }
}

async function verifyRefreshToken(token) {
  try {
    let result = await JWT.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  genAccessToken,
  verifyAccessToken,
  genRefreshToken,
  verifyRefreshToken,
};
