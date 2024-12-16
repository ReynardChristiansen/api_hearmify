const pool = require('../db');

const isValidJson = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
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
    updateSong
};
