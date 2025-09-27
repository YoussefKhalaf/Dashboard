// api/index.js
import { config } from 'dotenv';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { dbConnection } from '../config/dbConnection.js';

// Load environment variables
config();

let connected = false;
async function ensureDb() {
    if (connected) return;
    if (!process.env.DB_URI) {
        throw new Error('Missing DB_URI environment variable');
    }
    // Avoid reconnecting across invocations if connection is already open
    if (mongoose.connection.readyState === 1) {
        connected = true;
        return;
    }
    await dbConnection();
    connected = true;
}

// Graceful shutdown for Vercel
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing database connection');
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
});

// Vercel serverless handler
const expressHandler = serverless(app);

export default async function handler(req, res) {
    try {
        await ensureDb();
        return expressHandler(req, res);
    } catch (error) {
        console.error('Unhandled error in serverless handler:', error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}
