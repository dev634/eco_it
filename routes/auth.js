const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin");
const AuthController = require("../controllers/auth");
const Authentication = require("../middlewares/authentication");
const AdminModel = require("../models/admin");
const multer = require("multer");
const upload = multer();

router.get("/auth/connect", AuthController.connect);
router.get("/auth/subscribe", AuthController.subscribe);
router.get("/auth/forget", AuthController.forget);
router.get("/auth/logout", AuthController.logout);

router.post("/auth/connect", upload.none(), async function (req, res) {
  if (req.baseUrl === "/admin") {
    AdminController.postConnectAdmin(req, res);
  }
});

router.post("/auth/forget", upload.none(), async function (req, res) {
  if (req.baseUrl === "/admin") {
    AdminController.postForgetAdmin(req, res);
  }
});

router.post("/auth/register", upload.none(), async function (req, res) {
  if (req.baseUrl === "/admin") {
    AdminController.postAdmin(req, res);
  }
});

module.exports = router;
