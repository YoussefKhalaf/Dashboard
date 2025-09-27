import mongoose from "mongoose"


export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("DB connection has been established successfully.")
    } catch (err) {
        console.error("DB connection error:", err)
    }
}