const { access } = require("fs/promises");
const { constants } = require("fs");
const path = require("path");

module.exports.createFile = function () {};
module.exports.exists = async function (name) {
  const filePath = path.resolve(name);
  try {
    await access(filePath, constants.R_OK | constants.W_OK);
    return true;
  } catch (error) {
    return false;
  }
};
module.exports.deleteFile = function () {};
module.exports.appendFile = function () {};
