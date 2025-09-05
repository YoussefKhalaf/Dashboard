// import app from '../src/app.js';
import { dbConnection } from '../src/config/dbConnection.js';
import serverless from 'serverless-http';

let connected = false;
async function ensureDb() {
    if (!connected) {
        await dbConnection();
        connected = true;
    }
}

// حوّل الـ express app إلى serverless handler
const handler = serverless(app);

export default async function (req, res) {
    await ensureDb();
    return handler(req, res);
}
