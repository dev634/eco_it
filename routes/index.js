const express = require("express");
const router = express.Router();

const adminRouter = require("./admin");

router.get("/", function (req, res) {
  res.render("index", {
    pageTitle: "Welcome to Eco It",
  });
});

router.use(adminRouter);

router.all("*", function (req, res) {
  res.render("404");
});

module.exports = router;
