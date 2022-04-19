const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

function render(res, template, datas) {
  res.render(template, datas);
}

function redirect(res, url) {
  res.redirect(url);
}

async function hashPassword(pass) {
  try {
    const hashedPass = await bcrypt.hash(pass, Number(process.env.SALT_ROUNDS));
    return hashedPass;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  render,
  redirect,
  hashPassword,
};
