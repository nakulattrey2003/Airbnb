const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like 'Yahoo', 'Outlook', etc.
  auth: {
    user: process.env.MAIL_MY_EMAIL, // Replace with your email
    pass: process.env.MAIL_PASSWORD, // this comes from myaccount.google.com/apppasswords
  },
  tls: { rejectUnauthorized: false },
});

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
            images: [imageUrl],
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
      success_url: `${process.env.REACT_APP_API_URL}/payment/success`,
      cancel_url: `${process.env.REACT_APP_API_URL}/payment/cancel`,
    });

    res.json({ sucess: true, id: session.id });
  } catch (error) {
    console.error("Error creating payment session:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const sendEmailController = async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: `Nakul Attrey - Airbnb <${process.env.MAIL_MY_EMAIL}>`,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(`Error sending email: ${error.message}`);
    }

    console.log("Email sent:", info.response);
    res.status(200).send("Email sent: " + info.response);
  });
};

module.exports = { createPaymentController, sendEmailController };
