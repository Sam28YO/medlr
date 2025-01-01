const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  pharmacies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pharmacy" }],
});

module.exports = mongoose.model("Medicine", MedicineSchema);
