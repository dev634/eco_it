const express = require("express");
const router = express.Router();
const InstructorsController = require("../controllers/instructors");
const { render } = require("../helpers/server");
const Authentication = require("../middlewares/authentication");

router.get("/instructors", InstructorsController.instructors);
router.get("/instructors/:id", InstructorsController.instructor);
router.post("/instructors", InstructorsController.search);
module.exports = router;
