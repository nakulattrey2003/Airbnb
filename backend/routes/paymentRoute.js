const express = require("express");
const { createPaymentController, sendEmailController } = require("../controllers/paymentController");
const router = express.Router();

router.post("/checkout", createPaymentController);
router.post("/email", sendEmailController);

module.exports = router;
