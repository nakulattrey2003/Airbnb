const express = require("express");
const {
  getTripListController,
  addListingToWishlistController,
  getPropertyListController,
  getReservationListController,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:userId/trips", getTripListController);
router.patch(
  "/:userId/:listingId",
  authMiddleware,
  addListingToWishlistController
);
router.get("/:userId/properties", getPropertyListController);
router.get("/:userId/reservations", getReservationListController);

module.exports = router;

// wolf - 662daf6656908a8b00d33c2d
// batman - 662e26662e31c2394578b1e2
// Panchkula - 662dc0be56908a8b00d33c7c owned by wolf
// NY - 662e3ed5e1f8939013160a90 owned by batman
