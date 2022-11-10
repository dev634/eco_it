const UserModel = require("../models/users");
const AdminModel = require("../models/admin");
const Database = require("../services/database");
const HttpSuccess = require("../helpers/success");
const { makeResponse } = require("../helpers/response");
const { HttpErrors, errorsHandler } = require("../helpers/errors");
const Logger = require("../Services/logger");
const {
  redirect,
  render,
  hashPassword,
  comparePassword,
  genPassword,
} = require("../helpers/server");
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
    delete req.body.password_confirm;
    if (!value) {
      throw HttpErrors.Badrequest();
    }
    req.body.id = req.user.userId;
    req.body.password = await hashPassword(req.body.password);
    const result = await AdminModel.update(req.body);
    return makeResponse(res, HttpSuccess.Updated());
  } catch (error) {
    Logger(error);
    makeResponse(res, HttpErrors.BadRequest(res, error));
  }
}

async function deleteUser(req, res, next) {
  try {
    const result = await AdminModel.deleteAdmin({ id: { op: "=", value: req.user.userId } });
    return makeResponse(res, HttpSuccess.Deleted());
  } catch (error) {
    Logger(error);
    return makeResponse(res, HttpErrors.BadRequest(res, error));
  }
}

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
