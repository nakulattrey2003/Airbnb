const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createListingController,
  getListingByCategoryController,
  getListingBySearchController,
  getListingDetailsController,
} = require("../controllers/listingController");

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

router.post("/create", upload.array("listingPhotos"), createListingController);
router.get("/", getListingByCategoryController); // ex. clicking windmills icon
router.get("/search/:search", getListingBySearchController); // ex. searching for listing as category - windmills or title - beautiful beach house
router.get("/:listingId", getListingDetailsController); // ex. searching the list with id - 662dc0be56908a8b00d33c7c

module.exports = router;
