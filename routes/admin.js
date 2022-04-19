const express = require("express");
const router = express.Router();
const instructors = require("../mock_db/instructors");
const AdminController = require("../controllers/admin");
const AuthRoute = require("./auth");

router.use("/admin", AuthRoute);
router.get("/admin", AdminController.getAdmin);
router.get("/admin/instructors", function (req, res) {
  res.render("instructors", {
    pageTitle: "Gérer les instructeurs",
    layout: "admin",
    goBack: true,
    instructors,
  });
});
router.get("/admin/instructors/:id", function (req, res) {
  res.render("instructor", {
    pageTitle: `${instructors[0].firstname} ${instructors[0].lastname}`,
    layout: "admin",
    goBack: true,
    instructor: instructors[0],
  });
});

module.exports = router;
