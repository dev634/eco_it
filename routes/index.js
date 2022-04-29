const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const adminRouter = require("./admin");

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
