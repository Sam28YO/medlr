const mongoose = require("mongoose");

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }],
});

module.exports = mongoose.model("Pharmacy", PharmacySchema);
