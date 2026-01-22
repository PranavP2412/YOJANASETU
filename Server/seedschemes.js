import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import { Scheme } from "./src/models/schemes.models.js"; // Adjust path to your model

dotenv.config({ path: './.env' }); // Load your DB URL

const results = [];

// 1. Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/schemes`);
        console.log("✅ MongoDB Connected for Seeding");
    } catch (error) {
        console.error("❌ DB Connection Failed:", error);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    // 2. Clear existing schemes (Optional - safety to avoid duplicates)
    // await Scheme.deleteMany({});
    // console.log("🗑️  Old schemes cleared");

    // 3. Read the CSV File
    fs.createReadStream('schemes.csv') // Make sure this matches your filename
        .pipe(csv())
        .on('data', (data) => {
            // TRANSFORMATION LOGIC
            // Convert CSV row to Mongoose Object
            if(data['Scheme Name']) { // check if row is valid
                results.push({
                    schemeName: data['Scheme Name'],
                    ministry: "Ministry of MSME",
                    category: data['Category'],
                    description: data['Description'],
                    benefits: data['Benefits'],
                    eligibility: data['Eligibility'],
                    // SPLIT TAGS: "Loan;Startup" -> ["Loan", "Startup"]
                    tags: data['Tags'] ? data['Tags'].split(';').map(t => t.trim()) : [],
                    applicationLink: "https://www.msme.gov.in/",
                    isActive: true
                });
            }
        })
        .on('end', async () => {
            try {
                // 4. Insert into Database
                await Scheme.insertMany(results);
                console.log(`🎉 Successfully added ${results.length} schemes!`);
                process.exit();
            } catch (error) {
                console.error("❌ Error inserting data:", error);
                process.exit(1);
            }
        });
};

seedData();