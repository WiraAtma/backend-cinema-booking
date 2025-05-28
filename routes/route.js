const express = require('express');
const router = express.Router();
const FilmController = require('../controller/FilmController');
const SeatController = require('../controller/SeatController');
const BookingController = require('../controller/BookingController');

// Film Routes
router.get('/films', FilmController.getFilm);

// Seat Routes
router.get('/seats/:scheduleId', SeatController.getSeats);

// Booking Routes
router.post('/bookings', BookingController.postBooking);

module.exports = router;