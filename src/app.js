import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import { bootstrap } from './app.routers.js'
import { globalError } from './middleware/globalError.js'
const app = express()

//security
app.use(helmet())
app.use(cors())

//rate limiting
const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too Many Requests, Please Try Again Later"
})

//logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

//body parser 
app.use(express.json({
    limit: "10kb",
    verify: (req, res, buf) => {
        const rawData = buf.toString()
    }
}))

app.use(express.urlencoded({
    limit: "10kb",
    extended: true
}))

//compression
app.use(compression())

//routes
bootstrap(app, express())

//Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Dashboard Api",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development"
    })
})
// health check endpoint
app.get("/health", async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        res.send("✅ Database Connected!");
    } catch (err) {
        res.status(500).send("❌ Database not connected: " + err.message);
    }
});

//global error handler 
app.use(globalError)

export default app