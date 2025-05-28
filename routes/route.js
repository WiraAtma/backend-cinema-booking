const express = require('express');
const router = express.Router();
const FilmController = require('../controller/FilmController');
const SeatController = require('../controller/SeatController');

// Film Routes
router.get('/films', FilmController.getFilm);

// Seat Routes
router.get('/seats/:scheduleId', SeatController.getSeats);

module.exports = router;