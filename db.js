require('dotenv').config();  // Load .env file to access environment variables
const mysql = require('mysql2/promise');

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,   // Add port if you have it
    ssl: { rejectUnauthorized: false }  // Add SSL if needed (optional)
});

module.exports = pool;
