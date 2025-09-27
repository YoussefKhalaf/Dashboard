import {dbConnection} from '../config/dbConnection.js'
import mongoose from "mongoose";
import serverless from "serverless-http";
import app from "../src/app.js";

let isDbConnected = false;

// Connect once when cold start
async function ensureDb() {
    if (!isDbConnected) {
        try {
            await dbConnection();
            isDbConnected = true;
            console.log("✅ DB connected in cold start");
        } catch (err) {
            console.error("❌ DB connection error:", err.message);
        }
    }
}

// Health route
app.get("/health", async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            return res.status(200).json({
                success: true,
                message: "✅ Database Connected!",
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "❌ Database not connected",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "❌ Error checking DB: " + err.message,
        });
    }
});

const expressHandler = serverless(app);

export default async function handler(req, res) {
    try {
        await ensureDb(); // connect to DB if not already
        return expressHandler(req, res);
    } catch (error) {
        console.error("Unhandled error in serverless handler:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
