const dotenv = require("dotenv");
dotenv.config();

function logger(log) {
  if (["dev", "development"].includes(process.env.NODE_ENV)) {
    console.log(log);
  }

  if (["prod", "production"].includes(process.env.NODE_ENV)) {
    return;
  }
}

module.exports = logger;
