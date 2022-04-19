const AdminModel = require("../Models/admin");
const { render, hashPassword } = require("../helpers/server");

async function getAdmin(req, res) {
  let result = await AdminModel.checkAdmin();

  if (!result) {
    return render(res, "subscribe", {
      pageTitle: "Inscriptions",
      isAdmin: true,
      layout: "subscribe",
      goBack: true,
    });
  }

  render(res, "admin", {
    pageTitle: "Administration",
    layout: "admin",
    goBack: false,
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

module.exports = {
  getAdmin,
  postAdmin,
};
