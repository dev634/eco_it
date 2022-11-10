const AdminModel = require("../models/admin");
const InstructorModel = require("../models/instructors");
const StudentModel = require("../models/students");
const CoursesModel = require("../models/courses");
const Logger = require("../Services/logger");
const { sendPassword } = require("../Services/mailer");
const {
  redirect,
  render,
  hashPassword,
  comparePassword,
  genPassword,
} = require("../helpers/server");

const { genAccessToken, verifyAccessToken } = require("../helpers/jwt_help");
const authSchema = require("../validation/auth");
const { HttpErrors, errorsHandler } = require("../helpers/errors");
const HttpSuccess = require("../helpers/success");
const { makeTokenCookie } = require("../helpers/cookies");
const { makeResponse } = require("../helpers/response");
const dotenv = require("dotenv");
dotenv.config();

async function getAdmin(req, res) {
  try {
    const user = await AdminModel.getAdmin({ id: req.user.userId, role: "administrator" });
    render(res, "admin", {
      layout: "admin",
      pageTitle: "Administration",
      goBack: true,
      username: user[0].pseudo,
      instructorsNum: 0,
      studentsNum: 0,
      coursesNum: 0,
    });
  } catch (error) {
    Logger(error);
    makeResponse(res, error);
  }
}

async function adminConnect(req, res) {
  try {
    render(res, "connect", {
      pageTitle: "Connection",
      layout: "admin",
      goBack: true,
    });
  } catch (error) {
    Logger(error);
  }
}

async function adminSubscribe(req, res) {
  try {
    const adminExists = await AdminModel.checkAdmin();

    if (req.originalUrl === "/admin/auth/subscribe" && adminExists) {
      res.redirect("/admin/auth/connect");
      return;
    }
    render(res, "admin-subscribe", {
      pageTitle: "Inscription",
      layout: "admin",
      goBack: true,
    });
  } catch (error) {
    Logger(error);
  }
}

async function adminForget(req, res) {
  let result = await AdminModel.checkAdmin();
  if (!result) {
    return redirect(res, "/admin/auth/subscribe");
  }
  render(res, "forget", {
    pageTitle: "Mot de passe oublié",
    layout: "admin",
    goBack: true,
  });
}

async function adminLogout(req, res) {
  try {
    res.clearCookie("access_token");
    res.redirect("/admin");
  } catch (error) {
    makeResponse(res, HttpErrors.BadRequest());
  }
}

async function postAdmin(req, res) {
  try {
    const value = await authSchema.subscribe.validateAsync({ ...req.body });
    const max_age = Number(process.env.JWT_ACCESS_TOKEN_EXPIRE) * 1000;
    req.body.password = await hashPassword(req.body.password);
    req.body.role = "administrator";
    const result = await AdminModel.create(req.body);
    const accessToken = await genAccessToken(result.userId, {
      username: result.username,
    });
    makeTokenCookie(res, accessToken);
    return makeResponse(res, HttpSuccess.Created());
  } catch (error) {
    if (error.isJoi) {
      const details = { ...error.details[0] };
      if (details.type === "string.pattern.base") {
        return makeResponse(res, HttpErrors.BadRequest(`${error.details[0].path[0]} invalid.`));
      }
      return makeResponse(res, HttpErrors.BadRequest(details.message));
    }
    return makeResponse(res, HttpErrors.Internal(error));
  }
}

async function postConnectAdmin(req, res) {
  try {
    const value = await authSchema.connect.validateAsync({ ...req.body });
    const { email, password } = req.body;
    const result = await AdminModel.getAdmin({ email });
    const passCompared = await comparePassword(password, result[0].password);
    if (!passCompared) {
      throw HttpErrors.Unauthorized();
    }
    const token = await genAccessToken(result[0].id, { username: result[0].pseudo });
    makeTokenCookie(res, token);
    return makeResponse(res, HttpSuccess.Success());
  } catch (error) {
    return makeResponse(res, HttpErrors.Internal(error));
  }
}

async function postForgetAdmin(req, res) {
  try {
    let result = await AdminModel.getAdmin(req.body);

    if (!result) {
      throw HttpErrors.BadRequest();
    }

    //create new password
    let newPass = await genPassword();

    //hash password
    result.password = await hashPassword(newPass);

    //update with new hashed password
    let updated = await AdminModel.update(result);

    //send password
    await sendPassword(req.body.email, newPass, HttpErrors);

    return makeResponse(res, updated);
  } catch (error) {
    return makeResponse(res, HttpErrors.Internal(error));
  }
}

module.exports = {
  getAdmin,
  postAdmin,
  postConnectAdmin,
  postForgetAdmin,
  adminConnect,
  adminSubscribe,
  adminForget,
  adminLogout,
};
