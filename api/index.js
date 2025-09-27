// api/index.js
import { config } from "dotenv";
import serverless from "serverless-http";
import mongoose from "mongoose";
import app from "../src/app.js";   // هنا انت عامل export default app
import { dbConnection } from "../config/dbConnection.js";

// Load env variables
config();

let isConnected = false;

// Ensure MongoDB connection
async function connectDb() {
    if (isConnected) return;

    if (!process.env.DB_URI) {
        throw new Error("❌ Missing DB_URI environment variable");
    }

    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }

    await dbConnection();
    isConnected = true;
    console.log("✅ MongoDB connected");
}

// Wrap Express app with serverless handler
const expressHandler = serverless(app);

export default async function handler(req, res) {
    try {
        await connectDb();
        return expressHandler(req, res);
    } catch (err) {
        console.error("❌ Error in handler:", err);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: err.message,
            });
        }
    }
}
