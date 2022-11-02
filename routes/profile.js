const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profile");
const Authentication = require("../middlewares/authentication");

router.get(
  "/profile",
  Authentication.checkCookieMiddleware,
  Authentication.checkRole(["administrator"], () => res.redirect("/")),
  ProfileController.getUser
);

router.patch(
  "/profile",
  Authentication.checkCookieMiddleware,
  Authentication.checkRole(["administrator"], () => res.redirect("/")),
  ProfileController.updateUser
);

module.exports = router;
