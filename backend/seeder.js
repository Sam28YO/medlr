const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Medicine = require("./models/Medicine");
const Pharmacy = require("./models/Pharmacy");

dotenv.config();

const medicines = [
  { name: "Paracetamol", description: "Pain relief", price: 20 },
  { name: "Ibuprofen", description: "Anti-inflammatory", price: 50 },
  { name: "Cetrizine", description: "Allergy relief", price: 15 },
  { name: "Amoxicillin", description: "Antibiotic", price: 120 },
  { name: "Pantoprazole", description: "Acid reflux relief", price: 70 },
  { name: "Crocin", description: "Fever relief", price: 25 },
  { name: "ORS Powder", description: "Rehydration therapy", price: 10 },
  { name: "Dolo-650", description: "Fever and pain relief", price: 30 },
  { name: "Ascoril D", description: "Cough suppressant", price: 90 },
  { name: "Combiflam", description: "Pain and fever relief", price: 40 },
  { name: "Betadine", description: "Antiseptic solution", price: 50 },
  { name: "Chyawanprash", description: "Immunity booster", price: 250 },
];

const pharmacies = [
  { name: "Apollo Pharmacy", location: "Mumbai" },
  { name: "MedPlus", location: "Delhi" },
  { name: "1mg Pharmacy", location: "Bengaluru" },
  { name: "Netmeds", location: "Hyderabad" },
  { name: "HealthKart", location: "Chennai" },
  { name: "Guardian Pharmacy", location: "Pune" },
  { name: "DavaIndia", location: "Ahmedabad" },
  { name: "Wellness Forever", location: "Kolkata" },
  { name: "Sanjivani Pharmacy", location: "Jaipur" },
  { name: "Dhanwantari Medical", location: "Lucknow" },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Medicine.deleteMany();
    await Pharmacy.deleteMany();

    const insertedMedicines = await Medicine.insertMany(medicines);

    for (const pharmacy of pharmacies) {
      pharmacy.medicines = [
        insertedMedicines[0]._id,
        insertedMedicines[1]._id,
        insertedMedicines[2]._id,
        insertedMedicines[3]._id,
      ];
      await Pharmacy.create(pharmacy);
    }

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
