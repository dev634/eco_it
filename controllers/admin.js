const AdminModel = require("../Models/admin");
const { render } = require("../helpers/server");

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

module.exports = {
  getAdmin,
};
