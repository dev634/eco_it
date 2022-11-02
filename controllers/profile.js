const UserModel = require("../models/users");
const { makeResponse } = require("../helpers/response");
const { HttpErrors, errorsHandler } = require("../helpers/errors");
const Logger = require("../Services/logger");
const { redirect, render } = require("../helpers/server");

async function getUser(req, res, next) {
  try {
    const result = await UserModel.getUser({ id: req.user.userId }, ["pseudo", "email"]);
    const { pseudo, email } = result[0];
    render(res, "profile", {
      pseudo,
      email,
      layout: "admin",
      pageTitle: "Profile",
      goBack: true,
    });
  } catch (error) {
    Logger(error);
    makeResponse(res, HttpErrors.BadRequest(res, error));
  }
}

module.exports = {
  getUser,
};
