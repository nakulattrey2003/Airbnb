const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentController = async (req, res) => {
  try {
    const product = req.body;

    const imageUrl = product.listingPhotoPaths;

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.listingName,
            images: [imageUrl] ,
            description: `Booking from ${product.startDate} to ${product.endDate}`,
            metadata: {
              startDate: product.startDate,
              endDate: product.endDate,
            },
          },
          unit_amount: product.amount * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating payment session:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createPaymentController };
