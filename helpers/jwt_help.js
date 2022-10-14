const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function genAccessToken(datas, status) {
  try {
    const token = await JWT.sign({}, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRE),
      audience: JSON.stringify({ userId: datas.toString(), ...status }),
    });
    return token;
  } catch (error) {
    throw error;
  }
}

async function getAudience(accessToken) {
  try {
    const result = await JWT.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    const parsedToken = await JSON.parse(result.aud);
    return parsedToken;
  } catch (error) {
    throw error;
  }
}

async function decodeToken(token) {
  return await JWT.verify(token);
}

async function verifyAdminAccessToken(res, token, decodeToken, redirection) {
  try {
    const decodedToken = await decodeToken(token);
  } catch (error) {
    redirection();
  }
}

async function verifyAccessToken(token) {
  try {
    let result = await JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  genAccessToken,
  verifyAccessToken,
  getAudience,
  decodeToken,
  verifyAdminAccessToken,
};
