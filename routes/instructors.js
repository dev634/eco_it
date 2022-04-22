const express = require("express");
const router = express.Router();
const InstructorsController = require("../controllers/instructors");
const { render } = require("../helpers/server");

router.get("/instructors", async function (req, res) {
  if (req.baseUrl === "/admin") {
    await InstructorsController.instructors(req, res);
  }
});

router.get("/instructors/:id", async function (req, res) {
  if (req.baseUrl === "/admin") {
    await InstructorsController.instructor(req, res);
  }
});

module.exports = router;
