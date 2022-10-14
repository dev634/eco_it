const dotenv = require("dotenv");
dotenv.config();

function makeTokenCookie(res, accessToken) {
  res.cookie("access_token", accessToken, {
    maxAge: Number(process.env.COOKIE_EXPIRE) * 1000,
    httpOnly: true,
    secure: ["prod", "production"].includes(process.env.NODE_ENV),
  });
}

function checkCookie(req, name) {
  return !!req["cookies"][name];
}

module.exports = { makeTokenCookie, checkCookie };
