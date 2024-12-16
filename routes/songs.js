const express = require('express');
const authenticateToken = require('../middleware/middleware');
const { getSongById, getAllSongs, createSong, updateSong, registerUser, login, deleteSong } = require('../controllers/SongController'); // Import the updateSong function
const router = express.Router();

router.get('/getSongById/:id',authenticateToken, getSongById);
router.get('/getAllSongs',authenticateToken, getAllSongs);
router.post('/createSong',authenticateToken, createSong);
router.put('/updateSong/:id',authenticateToken, updateSong);
router.delete('/songs/:id', authenticateToken, deleteSong);
router.post('/register', registerUser);
router.post('/login', login);

module.exports = router;