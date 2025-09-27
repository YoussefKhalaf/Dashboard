import mongoose from "mongoose";

let isConnected = false; // cache connection

export const dbConnection = async () => {
    if (isConnected) {
        console.log("⚡ Using existing DB connection");
        return;
    }

    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        console.log("⚡ Already connected to MongoDB");
        return;
    }

    try {
        await mongoose.connect(process.env.DB_URI, {
            dbName: process.env.DB_NAME || undefined, // optional لو عندك DB_NAME
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = true;
        console.log("✅ DB connection established successfully");
    } catch (err) {
        console.error("❌ DB connection error:", err);
        throw err;
    }
};
