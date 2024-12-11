const express = require('express');
const { getSongById, getAllSongs } = require('../controllers/SongController');  // Import controller function
const router = express.Router();


// Route to get a song by its ID
router.get('/getSongById/:id', getSongById);
router.get('/getAllSongs', getAllSongs);

module.exports = router;
