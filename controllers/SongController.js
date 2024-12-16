const pool = require('../db');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;


const isValidJson = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

const getUser = async (req, res) => {
    const userId = req.user.id;  // Get the user ID from the authenticated JWT token

    try {
        // Query the database for the user with the provided user ID
        const [userResult] = await pool.query('SELECT id, name, role FROM users WHERE id = ?', [userId]);

        if (userResult.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userResult[0];  // Get the first user (as there should be only one result)

        return res.status(200).json({
            id: user.id,
            name: user.name,
            role: user.role,
        });

    } catch (error) {
        console.error('Error querying the database:', error);  // Log the error for debugging
        return res.status(500).json({ error: 'Database query failed' });  // Return generic error to client
    }
};

const login = async (req, res) => {
    const { name, password } = req.body;

    // Validate required fields
    if (!name || !password) {
        return res.status(400).json({ error: 'Name and password are required' });
    }

    try {
        // Check if the user exists in the database
        const [userResult] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);

        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult[0];

        // Hash the provided password to compare with the stored hash
        const hashedPassword = CryptoJS.SHA256(password).toString();

        if (hashedPassword !== user.password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate a JWT
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                role: user.role,
            },
            SECRET_KEY,
            { expiresIn: '30d' } // Token expires in 1 hour
        );

        return res.status(200).json({
            message: 'Login successful',
            id: user.id,
            token: token,
        });
    } catch (error) {
        console.error('Error logging in:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Failed to login' }); // Return a generic error to the client
    }
};

const deleteSong = async (req, res) => {
    const { id } = req.params; // Get the song ID from the URL parameter

    try {
        // Check if the song exists
        const [result] = await pool.query('SELECT * FROM songs WHERE id = ?', [id]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'No such song to delete' });
        }

        // Delete the song from the database
        const [deleteResult] = await pool.query('DELETE FROM songs WHERE id = ?', [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: 'No such song to delete' });
        }

        return res.status(200).json({
            message: 'Song deleted successfully',
            Id: id,
        });
    } catch (error) {
        console.error('Error deleting the song:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Failed to delete the song' }); // Return a generic error to the client
    }
};

const registerUser = async (req, res) => {
    const { name, password, role } = req.body;

    // Validate required fields
    if (!name || !password) {
        return res.status(400).json({ error: 'Name and password are required' });
    }

    // Validate role, if provided
    if (role && role !== 'admin' && role !== 'user') {
        return res.status(400).json({ error: 'Invalid role. Allowed roles are "admin" or "user"' });
    }

    try {
        // Check if the username already exists
        const [existingUser] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'User already exists' }); // Conflict error
        }

        // Hash the password using CryptoJS SHA256
        const hashedPassword = CryptoJS.SHA256(password).toString();

        // Insert the new user into the database
        const [result] = await pool.query(
            'INSERT INTO users (name, password, role) VALUES (?, ?, ?)',
            [name, hashedPassword, role || 'user'] // Default role is 'user'
        );

        // Respond with success and the new user ID
        return res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
        });
    } catch (error) {
        console.error('Error registering user:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Failed to register user' }); // Return generic error to client
    }
};

const updateSong = async (req, res) => {
    const { id } = req.params; // Get the song ID from the URL parameter
    const { title, lyrics, chords } = req.body; // Get the updated song details from the request body

    // Validate required fields
    if (!title || !lyrics || !chords) {
        return res.status(400).json({ error: 'Title, lyrics, and chords are required' });
    }

    try {
        // Convert lyrics and chords to JSON strings if they are arrays
        const lyricsJson = Array.isArray(lyrics) ? JSON.stringify(lyrics) : lyrics;
        const chordsJson = Array.isArray(chords) ? JSON.stringify(chords) : chords;

        // Update the song in the database
        const [result] = await pool.query(
            'UPDATE songs SET title = ?, lyrics = ?, chords = ? WHERE id = ?',
            [title, lyricsJson, chordsJson, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No such song to update' });
        }

        return res.status(200).json({
            message: 'Song updated successfully',
            Id: id,
        });
    } catch (error) {
        console.error('Error updating the song:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Failed to update the song' }); // Return a generic error to the client
    }
};

const createSong = async (req, res) => {
    const { title, lyrics, chords } = req.body; // Get song details from the request body

    // Validate required fields
    if (!title || !lyrics || !chords) {
        return res.status(400).json({ error: 'Title, lyrics, and chords are required' });
    }

    try {
        // Convert lyrics and chords to JSON strings if they are arrays
        const lyricsJson = Array.isArray(lyrics) ? JSON.stringify(lyrics) : lyrics;
        const chordsJson = Array.isArray(chords) ? JSON.stringify(chords) : chords;

        // Insert the new song into the database
        const [result] = await pool.query(
            'INSERT INTO songs (title, lyrics, chords) VALUES (?, ?, ?)',
            [title, lyricsJson, chordsJson]
        );

        // Respond with the newly created song ID
        return res.status(201).json({
            message: 'Song created successfully',
            Id: result.insertId,
        });
    } catch (error) {
        console.error('Error creating the song:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Failed to create the song' }); // Return a generic error to the client
    }
};

// Get a song by its ID
const getSongById = async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameter

    try {
        // Query the database for the song with the given ID
        const [rows] = await pool.query('SELECT * FROM songs WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "No Such Song" });
        }

        const song = rows[0];

        // Safely handle lyrics and chords fields
        let lyrics = [];
        let chords = [];

        // Handle lyrics field
        if (Array.isArray(song.lyrics)) {
            lyrics = song.lyrics;  // Already an array, no need to parse
        } else if (isValidJson(song.lyrics)) {
            lyrics = JSON.parse(song.lyrics);  // Parse the JSON string if it's not already an array
        } else {
            console.error('Invalid lyrics data:', song.lyrics);
            return res.status(500).json({ error: 'Invalid lyrics data' });
        }

        // Handle chords field
        if (Array.isArray(song.chords)) {
            chords = song.chords;  // Already an array, no need to parse
        } else if (isValidJson(song.chords)) {
            chords = JSON.parse(song.chords);  // Parse the JSON string if it's not already an array
        } else {
            console.error('Invalid chords data:', song.chords);
            return res.status(500).json({ error: 'Invalid chords data' });
        }

        return res.status(200).json({
            id: song.id,
            title: song.title,
            lyrics: lyrics,  // Safely handled lyrics
            chords: chords   // Safely handled chords
        });

    } catch (error) {
        console.error('Error querying the database:', error);  // Log the error for debugging
        return res.status(500).json({ error: 'Database query failed' });  // Return generic error to client
    }
};

const getAllSongs = async (req, res) => {
    try {
        // Query the database for all songs
        const [rows] = await pool.query('SELECT * FROM songs');

        if (rows.length === 0) {
            return res.status(404).json({ error: "No Songs Found" });
        }

        // Safely handle lyrics and chords fields for all songs
        const songs = rows.map(song => {
            return {
                id: song.id,
                title: song.title,
            };
        });

        return res.status(200).json(songs);  // Return all songs as JSON response

    } catch (error) {
        console.error('Error querying the database:', error);  // Log the error for debugging
        return res.status(500).json({ error: 'Database query failed' });  // Return generic error to client
    }
};

module.exports = {
    getSongById,
    getAllSongs,
    createSong,
    updateSong,
    registerUser,
    login,
    deleteSong,
    getUser
};
