import mongoose from "mongoose"


export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS: 8000,
            connectTimeoutMS: 10000
        })
        console.log("DB connection has been established successfully.")
    } catch (err) {
        console.error("DB connection error:", err)
        // Rethrow so serverless handler can return 500 and logs show the cause
        throw err
    }
}