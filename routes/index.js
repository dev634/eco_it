const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const adminRouter = require("./admin");
const jwt = require("jsonwebtoken");
const { makeResponse } = require("../helpers/response");
const { HttpErrors } = require("../helpers/errors");
const { checkAdmin } = require("../models/admin");
const { verifyAccessToken } = require("../helpers/jwt_help");

router.get("/", function (req, res) {
  res.render("index", {
    pageTitle: "Welcome to Eco It",
  });
});

router.get("/test", async function (req, res) {
  res.render("test");
});
router.post("/test", upload.none(), async function (req, res) {
  if (!req.body.firstname.length || !req.body.email.length) {
    res.redirect("/test");
    return;
  }

  res.send("Hello");
});

router.use(adminRouter);

router.all("*", function (req, res) {
  res.render("404");
});

module.exports = router;
