const express = require("express");
const Medicine = require("../models/Medicine");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  const { name } = req.query;

  try {
    let query = {};
    if (name) {
      query = { name: { $regex: name, $options: "i" } };
    }

    const medicines = await Medicine.find(query)
      .populate("pharmacies", "name location")
      .limit(20);
    res.json(medicines);
  } catch (error) {
    console.error("Medicine fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate(
      "pharmacies",
      "name location"
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (error) {
    console.error("Medicine detail fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
