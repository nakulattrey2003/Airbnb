const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Booking = require("../models/bookingModel.js");
const User = require("../models/userModel.js");
const Listing = require("../models/listingModel.js");

const updateUserController = async (req, res) => {
  try {
    const userId = req.params.userId;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* Generate JWT token */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { name, password } = req.body;

    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    let profileImagePath = profileImage.path;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    if (name) user.name = name;
    if (password) user.password = hashedPassword;
    if (profileImagePath) user.profileImagePath = profileImagePath;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user, token });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: "Can not find reservations!", error: err.message });
  }
};

const getTripListController = async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Booking.find({ customerId: userId }).populate(
      "customerId hostId listingId"
    );
    res.status(202).json(trips); // the trips data is sent to the frontend
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: "Can not find trips!", error: err.message });
  }
};

const addListingToWishlistController = async (req, res) => {
  try {
    const { userId, listingId } = req.params;
    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId).populate("creator");

    const favoriteListing = user.wishList.find(
      // checking if the item is present in the wishlist
      (item) => item._id.toString() === listingId
    );

    if (favoriteListing) {
      user.wishList = user.wishList.filter(
        // if it is present then remove it from the list else add it to the wishlist
        (item) => item._id.toString() !== listingId
      );
      await user.save();
      res.status(200).json({
        message: "Listing is removed from wish list",
        wishList: user.wishList,
      });
    } else {
      user.wishList.push(listing);
      await user.save();
      res.status(200).json({
        message: "Listing is added to wish list",
        wishList: user.wishList,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const getPropertyListController = async (req, res) => {
  try {
    const { userId } = req.params;
    const properties = await Listing.find({ creator: userId }).populate(
      "creator"
    );
    res.status(202).json(properties);
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: "Can not find properties!", error: err.message });
  }
};

const getReservationListController = async (req, res) => {
  try {
    const { userId } = req.params;
    const reservations = await Booking.find({ hostId: userId }).populate(
      "customerId hostId listingId"
    );
    res.status(202).json(reservations);
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: "Can not find reservations!", error: err.message });
  }
};

module.exports = {
  getTripListController,
  addListingToWishlistController,
  getPropertyListController,
  getReservationListController,
  updateUserController,
};
