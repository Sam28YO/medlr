const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/favorites/:id", auth, async (req, res) => {
  console.log("Authenticated User ID:", req.user.id);

  try {
    const user = await User.findById(req.user.id);
    const medicineId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ message: "Invalid medicine ID" });
    }

    if (user.favorites.includes(medicineId)) {
      return res
        .status(400)
        .json({ message: "Medicine is already in favorites" });
    }

    user.favorites.push(medicineId);
    await user.save();

    res.status(200).json({ message: "Added to favorites!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add to favorites" });
  }
});

router.delete("/favorites/:id", auth, async (req, res) => {
  console.log("Authenticated User ID:", req.user.id);

  try {
    const user = await User.findById(req.user.id);
    const medicineId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ message: "Invalid medicine ID" });
    }

    if (!user.favorites.includes(medicineId)) {
      return res.status(400).json({ message: "Medicine not in favorites" });
    }

    user.favorites.pull(medicineId);
    await user.save();

    res.status(200).json({ message: "Removed from favorites!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove from favorites" });
  }
});

router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching favorites" });
  }
});

module.exports = router;
