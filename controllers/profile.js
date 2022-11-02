const UserModel = require("../models/users");
const Database = require("../services/database");
const { makeResponse } = require("../helpers/response");
const { HttpErrors, errorsHandler } = require("../helpers/errors");
const Logger = require("../Services/logger");
const { redirect, render } = require("../helpers/server");
const profileSchema = require("../validation/profile");

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

async function updateUser(req, res, next) {
  try {
    const value = await profileSchema.update.validateAsync({ ...req.body });
    const result = await Database.update({ id: req.user.userId });
    return result;
  } catch (error) {
    Logger(error);
    makeResponse(res, HttpErrors.BadRequest(res, error));
  }
}

module.exports = {
  getUser,
  updateUser,
};
