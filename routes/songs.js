const express = require('express');
const authenticateToken = require('../middleware/middleware');
const { getSongById, getAllSongs, createSong, updateSong, registerUser, login, deleteSong, getUser, getAllMember, changeRoleToAdmin, addTesting } = require('../controllers/SongController');
const router = express.Router();

router.get('/getSongById/:id', authenticateToken, getSongById);
router.get('/getAllSongs', authenticateToken, getAllSongs);
router.get('/getAllUser', authenticateToken, getAllMember);
router.put('/promote/:id', authenticateToken, changeRoleToAdmin);
router.post('/createSong', authenticateToken, createSong);
router.put('/updateSong/:id', authenticateToken, updateSong);
router.delete('/delete/:id', authenticateToken, deleteSong);
router.get('/getUser', authenticateToken, getUser);
router.post('/register', registerUser);
router.post('/login', login);
router.get('/AddTesting', addTesting);

var cron = require('node-cron');

cron.schedule('* * * * *', () => {
  console.log('Running a task every minute to fetch data...');

  fetch('https://api-hearmify.vercel.app/api/songs/AddTesting')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Data fetched:', data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

module.exports = router;
