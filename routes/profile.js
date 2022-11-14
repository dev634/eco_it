const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profile");
const Authentication = require("../middlewares/authentication");
const multer = require("multer");
const upload = multer();

router.get("/profile", ProfileController.getUser);
router.patch("/profile", upload.none(), ProfileController.updateUser);
router.delete("/profile", ProfileController.deleteUser);

module.exports = router;
