const AdminModel = require("../Models/admin");
const { sendPassword } = require("../Services/mailer");
const {
  redirect,
  render,
  hashPassword,
  comparePassword,
  genPassword,
} = require("../helpers/server");

async function getAdmin(req, res) {
  let result = await AdminModel.checkAdmin();

  //check if no admin exists
  if (!result) {
    return redirect(res, "/admin/auth/subscribe");
  }

  //check if admin exists and if user admin not connected
  if (result && true) {
    return redirect(res, "/admin/auth/connect");
  }

  render(res, "admin", {
    pageTitle: "Administration",
    layout: "admin",
    goBack: false,
  });
}

async function adminConnect(req, res) {
  render(res, "connect", {
    pageTitle: "Connection",
    layout: "admin",
    goBack: true,
  });
}

async function adminSubscribe(req, res) {
  render(res, "admin-subscribe", {
    pageTitle: "Inscription",
    layout: "admin",
    goBack: true,
  });
}

async function adminForget(req, res) {
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
    res.status(result.status).json(result);
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
    res.status(200).json({
      status: 200,
      message: "Authorized",
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
