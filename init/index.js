require("dotenv").config({ path: "../.env" });
console.log("DB_URL:", process.env.DB_URL);  // Check if DB_URL is loaded

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const review = require("../models/review.js");

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  console.error("DB_URL is undefined. Check your .env file.");
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to DB");
    await initDB();
  } catch (err) {
    console.error("Connection error:", err);
  }
}

const initDB = async () => {
  try {
    
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj)=>({...obj,owner:"672120c597d77d30a566ad03"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};

main();
