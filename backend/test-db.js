const mongoose = require("mongoose");
require("dotenv").config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully!");
    process.exit();
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
})();
