const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin.js");
const multer = require("multer");
const upload = multer();

router.post("/auth/register", upload.none(), async function (req, res) {
  if (req.baseUrl === "/admin") {
    AdminController.postAdmin(req, res);
  }
});

module.exports = router;
