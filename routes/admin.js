const express = require("express");
const router = express.Router();
const instructors = require("../mock_db/instructors");
const AdminController = require("../controllers/admin");
const AuthRoute = require("./auth");
const InstructorsRoute = require("./instructors");

router.use("/admin", AuthRoute);
router.use("/admin", InstructorsRoute);
router.get("/admin", AdminController.getAdmin);

module.exports = router;
