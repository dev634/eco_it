const express = require("express");
const router = express.Router();
const InstructorsController = require("../controllers/instructors");
const { render } = require("../helpers/server");
const Authentication = require("../middlewares/authentication");

router.get(
  "/instructors",
  Authentication.checkCookieMiddleware,
  Authentication.checkRole(["administrator", "instructor"], () => res.redirect("/")),
  InstructorsController.instructors
);
router.get("/instructors/:id", InstructorsController.instructor);

module.exports = router;
