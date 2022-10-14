const bcrypt = require("bcrypt");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

function render(res, template, datas) {
  res.render(template, datas);
}

function redirect(res, url) {
  return res.redirect(url);
}

async function genPassword(passphrase) {
  const secret = "123456";
  const random = Math.floor(Math.random() * 1000000);
  try {
    const hash = await crypto
      .createHmac("sha256", secret)
      .update(random.toString())
      .digest("hex")
      .toString()
      .substring(0, 10);
    return hash;
  } catch (error) {
    throw error;
  }
}

async function hashPassword(pass) {
  try {
    const hashedPass = await bcrypt.hash(pass, Number(process.env.SALT_ROUNDS));
    return hashedPass;
  } catch (error) {
    throw {
      status: 500,
      message: "Something wrong",
    };
  }
}

async function comparePassword(pass, hashedPass) {
  try {
    return await bcrypt.compare(pass, hashedPass);
  } catch (error) {
    throw {
      status: 500,
      message: "Something wrong",
    };
  }
}

module.exports = {
  render,
  redirect,
  hashPassword,
  comparePassword,
  genPassword,
};
