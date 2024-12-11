require('dotenv').config();  // Load environment variables
const express = require('express');
const cors = require('cors');
const songRoutes = require('./routes/songs');  // Import the song routes

const app = express();  // Initialize Express app

// CORS configuration
const corsConfig = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
};
app.use(cors(corsConfig));

// Middleware for parsing JSON
app.use(express.json());

// Song routes
app.use('/api/songs', songRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});