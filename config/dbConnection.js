import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        console.log("=== Debug DB Connection ===");
        console.log("DB_URI exists?", !!process.env.DB_URI);
        if (process.env.DB_URI) {
            console.log("DB_URI starts with:", process.env.DB_URI.substring(0, 30) + "...");
        }

        // محاولة الاتصال
        await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS: 20000, // 20 ثانية بدل ما يفضل يهنج
        });

        console.log("✅ DB connection has been established successfully.");
    } catch (err) {
        console.error("❌ DB connection error:");
        console.error(err.message);
        throw err;
    }
};
