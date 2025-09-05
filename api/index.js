// api/index.js
import { config } from 'dotenv';
import app from '../src/app.js';
import { dbConnection } from '../config/dbConnection.js';

// Load environment variables
config();

let connected = false;
async function ensureDb() {
    if (!connected) {
        await dbConnection();
        connected = true;
    }
}

// Vercel serverless handler
export default async function handler(req, res) {
    await ensureDb();
    return app(req, res);
}
