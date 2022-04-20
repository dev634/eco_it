const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin.js");
const multer = require("multer");
const upload = multer();

router.get("/auth/connect", AdminController.adminConnect);
router.get("/auth/subscribe", AdminController.adminSubscribe);
router.get("/auth/forget", AdminController.adminForget);

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
