const express = require("express");
const {
  getTripListController,
  addListingToWishlistController,
  getPropertyListController,
  getReservationListController,
  updateUserController,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

const multer = require("multer");

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

router.patch(
  "/:userId/update",
  upload.single("profileImage"),
  updateUserController
);
router.get("/:userId/trips", getTripListController);
router.patch("/:userId/:listingId", addListingToWishlistController);
router.get("/:userId/properties", getPropertyListController);
router.get("/:userId/reservations", getReservationListController);

module.exports = router;

// wolf - 662daf6656908a8b00d33c2d
// batman - 662e26662e31c2394578b1e2
// Panchkula - 662dc0be56908a8b00d33c7c owned by wolf
// NY - 662e3ed5e1f8939013160a90 owned by batman
