const express = require("express");
const Pharmacy = require("../models/Pharmacy");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  const { medicineId } = req.query;

  try {
    const pharmacies = await Pharmacy.find({ medicines: medicineId });
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
