import express from "express";
import mongoose from "mongoose";

const app = express();

// Middleware عشان نعرف أي request جاي
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Route أساسي
app.get("/", (req, res) => {
    console.log("GET / route hit ✅");
    res.send("Hello from Express on Vercel 🚀");
});

// Health check
app.get("/health", (req, res) => {
    console.log("GET /health route hit ✅");
    res.json({ success: true, message: "Server is healthy" });
});

// MongoDB connect
mongoose
    .connect(process.env.DB_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
    });

export default app;
