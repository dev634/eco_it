const AdminModel = require("../Models/admin");
const InstructorModel = require("../Models/instructors");
const StudentModel = require("../Models/students");
const CoursesModel = require("../Models/courses");
const { sendPassword } = require("../Services/mailer");
const {
  redirect,
  render,
  hashPassword,
  comparePassword,
  genPassword,
} = require("../helpers/server");
const { genAccessToken, verifyAccessToken } = require("../helpers/jwt_help");

async function getAdmin(req, res) {
  let result = await AdminModel.checkAdmin();
  let instructors = await InstructorModel.getAll();
  let students = await StudentModel.getAll();
  let courses = await CoursesModel.getAll();
  let averageCoursesPerInstructors = isNaN(Number(courses) / Number(instructors))
    ? 0
    : Math.floor(Number(courses) / Number(instructors));

  //check if no admin exists
  if (!result) {
    return redirect(res, "/admin/auth/subscribe");
  }

  // if admin but no token access
  if (result && !req.query.access_token) {
    return redirect(res, "/admin/auth/connect");
  }

  //if access token
  if (req.query.access_token) {
    let testAccessToken = await verifyAccessToken(req.query.access_token);

    if (result && !testAccessToken) {
      return redirect(res, "/admin/auth/connect");
    }
  }

  render(res, "admin", {
    pageTitle: "Administration",
    layout: "admin",
    goBack: false,
    instructorsNum: instructors.length,
    studentsNum: students.length,
    coursesNum: courses.length,
    averageCoursesPerInstructors,
  });
}

async function adminConnect(req, res) {
  let result = await AdminModel.checkAdmin();

  if (!result) {
    return redirect(res, "/admin/auth/connect");
  }

  render(res, "connect", {
    pageTitle: "Connection",
    layout: "admin",
    goBack: true,
  });
}

async function adminSubscribe(req, res) {
  let result = await AdminModel.checkAdmin();

  if (result) {
    return redirect(res, "/admin/auth/connect");
  }

  render(res, "admin-subscribe", {
    pageTitle: "Inscription",
    layout: "admin",
    goBack: true,
  });
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

async function postAdmin(req, res) {
  try {
    req.body.password = await hashPassword(req.body.password);
    let result = await AdminModel.create(req.body);
    let accessToken = await genAccessToken(result.userId);

    res.status(201).json({
      status: 201,
      accessToken,
    });
  } catch (error) {
    res.status(error.status).json(error);
  }
}

async function postConnectAdmin(req, res) {
  try {
    let result = await AdminModel.getAdmin(req.body);
    let passCompared = await comparePassword(req.body.password, result.password);
    if (!passCompared) {
      throw {
        status: 401,
        message: "Unauthorized",
      };
    }

    let token = await genAccessToken(result.id);
    res.status(200).json({
      status: 200,
      message: "Authorized",
      accessToken: token,
    });
  } catch (error) {
    res.status(error.status).json(error);
  }
}

async function postForgetAdmin(req, res) {
  try {
    let result = await AdminModel.getAdmin(req.body);

    if (!result) {
      throw {
        status: 400,
        message: "Bad request",
      };
    }

    //create new password
    let newPass = await genPassword();

    //hash password
    result.password = await hashPassword(newPass);

    //update with new hashed password
    let updated = await AdminModel.update(result);

    //send password
    await sendPassword(req.body.email, newPass);

    res.status(updated.status).json(updated);
  } catch (error) {
    res.status(error.status).json(error);
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
};
