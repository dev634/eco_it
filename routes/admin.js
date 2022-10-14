const express = require("express");
const router = express.Router();
const instructors = require("../mock_db/instructors");
const AdminController = require("../controllers/admin");
const Authentication = require("../middlewares/authentication");
const AdminModel = require("../Models/admin");
const AuthRoute = require("./auth");
const InstructorsRoute = require("./instructors");
const { verifyAccessToken, decodeToken } = require("../helpers/jwt_help");
const { makeResponse } = require("../helpers/response");
const { HttpErrors } = require("../helpers/errors");
const { getAdmin } = require("../models/admin");
const ROLES = require("../constantes/roles");
const dotenv = require("dotenv");
dotenv.config();

router.use("/admin", AuthRoute);
router.use("/admin", InstructorsRoute);
router.get(
  "/admin",
  Authentication.checkAdminMiddleware,
  Authentication.checkCookieMiddleware,
  Authentication.checkRole(["administrator"], () => res.redirect("/")),
  AdminController.getAdmin
);

module.exports = router;
