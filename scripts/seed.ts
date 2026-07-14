import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User";
import * as dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("🧹 Cleared existing users");

    const passwordHash = await bcrypt.hash("password123", 10);

    const users = [
      {
        pseudonym: "Dr. Sharma",
        password: passwordHash,
        role: "counsellor",
        college: "Engineering Institute",
        department: "Student Welfare",
        semester: 1,
        onboardingDone: true,
      },
      {
        pseudonym: "BlueFalcon22",
        password: passwordHash,
        role: "student",
        college: "Engineering Institute",
        department: "Computer Science",
        semester: 4,
        onboardingDone: true,
      },
      {
        pseudonym: "NeonTiger89",
        password: passwordHash,
        role: "peer_supporter",
        college: "Engineering Institute",
        department: "Mechanical",
        semester: 6,
        isPeerCertified: true,
        peerTrainingCompleted: true,
        onboardingDone: true,
      },
      {
        pseudonym: "SilentOwl44",
        password: passwordHash,
        role: "student",
        college: "Engineering Institute",
        department: "Civil",
        semester: 2,
        onboardingDone: true,
      }
    ];

    await User.insertMany(users);
    console.log(`🌱 Seeded ${users.length} users successfully!`);
    
    console.log("\nAccounts created (password is 'password123' for all):");
    users.forEach(u => console.log(`- ${u.pseudonym} (${u.role})`));

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
  }
}

seed();
