const AdminController = require("./admin");

async function logout(req, res) {
  try {
    res.clearCookie("access_token");
    res.redirect("/admin");
  } catch (error) {
    makeResponse(res, HttpErrors.BadRequest());
  }
}

async function connect(req, res) {
  try {
    if (req.baseUrl === "/admin") {
      return await AdminController.adminConnect(req, res);
    }
  } catch (error) {
    makeResponse(res, error);
  }
}

async function subscribe(req, res) {
  try {
    if (req.baseUrl === "/admin") {
      return AdminController.adminSubscribe(req, res);
    }
  } catch (error) {
    makeResponse(req, res);
  }
}

async function forget(req, res) {
  try {
    if (req.baseUrl === "/admin") {
      return AdminController.adminForget(req, res);
    }
  } catch (error) {
    makeResponse(req, res);
  }
}

module.exports = {
  logout,
  connect,
  subscribe,
  forget,
};
