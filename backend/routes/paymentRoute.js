const express = require("express");
const { createPaymentController } = require("../controllers/paymentController");
const router = express.Router();

router.post("/checkout", createPaymentController);

module.exports = router;
