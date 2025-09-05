import mongoose from "mongoose"


export const dbConnection = async () => {
    await mongoose.connect(process.env.DB_URI).then(() => {
        console.log("DB connection has been established successfully.")
    }).catch((err) => {
        console.log("DB connection error. error: ", err)
    })
}