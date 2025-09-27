// api/index.js
import { config } from "dotenv";
import serverless from "serverless-http";
import mongoose from "mongoose";
import app from "../src/app.js";
import { dbConnection } from "../config/dbConnection.js";

// Load environment variables
config();

// Wrap Express app with serverless handler
const expressHandler = serverless(app);

export default async function handler(req, res) {
    console.log("🌍 Incoming request:", req.url);

    try {
        // Connect to DB (with caching inside dbConnection.js)
        if (mongoose.connection.readyState !== 1) {
            await dbConnection();
        }

        // Forward request to Express
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
