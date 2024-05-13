const express = require("express");
const { createBookingController } = require("../controllers/bookingController");
const router = express.Router();

router.post("/create", createBookingController); // like wolf has booked batman's new york residence

module.exports = router;
