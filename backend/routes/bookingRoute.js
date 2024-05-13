const express = require("express");
const { createBookingController } = require("../controllers/bookingController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", authMiddleware, createBookingController); // like wolf has booked batman's new york residence

module.exports = router;
