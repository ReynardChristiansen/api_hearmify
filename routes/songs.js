const express = require('express');
const { getSongById, getAllSongs, createSong, updateSong } = require('../controllers/SongController'); // Import the updateSong function
const router = express.Router();

router.get('/getSongById/:id', getSongById);
router.get('/getAllSongs', getAllSongs);
router.post('/createSong', createSong);
router.put('/updateSong/:id', updateSong); // Add the PUT route for updating a song

module.exports = router;