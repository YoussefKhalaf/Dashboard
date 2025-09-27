import serverless from 'serverless-http';
import { config } from 'dotenv';
import { dbConnection } from '../config/dbConnection.js';
import app from '../src/app.js';

// Load environment variables
config();

// Connect to database
dbConnection().catch(console.error);

// Export the serverless handler
export default serverless(app);
