// api/index.js
import app from '../src/app.js';
import { dbConnection } from '../src/config/dbConnection.js';
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
    return app(req, res); // Express app بيتعامل كـ handler
}
