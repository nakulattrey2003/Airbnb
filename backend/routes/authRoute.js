const express = require("express");
const {
  registerController,
  loginController,
  googleController,
} = require("../controllers/authController");
const multer = require("multer");
const router = express.Router();

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

router.post("/register", upload.single("profileImage"), registerController);
router.post("/login", loginController);
router.post("/google", googleController);

module.exports = router;
