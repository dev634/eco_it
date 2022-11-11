const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profile");
const Authentication = require("../middlewares/authentication");
const multer = require("multer");
const upload = multer();

router.get(
  "/profile",
  Authentication.checkAdminMiddleware,
  Authentication.checkCookieMiddleware,
  Authentication.checkRole(["administrator"], () => res.redirect("/")),
  ProfileController.getUser
);

router.patch(
  "/profile",
  Authentication.checkCookieMiddleware,
  Authentication.checkRole(["administrator"], () => res.redirect("/")),
  upload.none(),
  ProfileController.updateUser
);

router.delete(
  "/profile",
  Authentication.checkCookieMiddleware,
  Authentication.checkRole(["administrator"], () => res.redirect("/")),
  ProfileController.deleteUser
);

module.exports = router;
