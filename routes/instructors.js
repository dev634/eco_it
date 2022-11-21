const express = require("express");
const router = express.Router();
const InstructorsController = require("../controllers/instructors");
const { render } = require("../helpers/server");
const Authentication = require("../middlewares/authentication");
const multer = require("multer");
const upload = multer();

router.get("/instructors", InstructorsController.instructors);
router.get("/instructors/all", InstructorsController.instructorsAll);
router.get("/instructors/:id", InstructorsController.instructor);
router.post("/instructors", upload.none(), InstructorsController.search);
module.exports = router;
