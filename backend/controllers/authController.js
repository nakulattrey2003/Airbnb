const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const axios = require("axios");

const User = require("../models/userModel.js");

const registerController = async (req, res) => {
  try {
    /* Take all information from the form */
    const { name, email, password } = req.body;

    /* The uploaded file is available as req.file */
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    /* path to the uploaded profile photo */
    const profileImagePath = profileImage.path;

    /* Check if user exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    /* Hass the password */
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    /* Create a new User */
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    /* Save the new User */
    await newUser.save();

    /* Send a successful message */
    res
      .status(200)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Registration failed!", error: err.message });
  }
};

const loginController = async (req, res) => {
  try {
    /* Take the infomation from the form */
    const { email, password } = req.body;

    /* Check if user exists */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    /* Compare the password with the hashed password */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    /* Generate JWT token */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const googleController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      // const { password: pass, ...rest } = user._doc;
      res.status(200).json({ token, user });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new User({
        name:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        profileImagePath: req.body.profileImagePath,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      // const { password: pass, ...rest } = newUser._doc;
      // res
      //   .cookie("access_token", token, { httpOnly: true })
      //   .status(200)
      //   .json(rest);
      res.status(200).json({ token, user: newUser });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerController, loginController, googleController };
