const express = require('express');
const router = express.Router();
const FilmController = require('../controller/FilmController');
const SeatController = require('../controller/SeatController');
const BookingController = require('../controller/BookingController');

// Film Routes
// Mengambil daftar film detail jam tayang dan jam selesai
router.get('/films', FilmController.getFilm);

// Seat Routes
// mengambil daftar kursi berdasarkan film yang ada
router.get('/seats/:scheduleId', SeatController.getSeats);

// Booking Routes
// Memesan kursi lalu akan mengunci sementara sampai ada konfirmasi 
router.post('/bookings', BookingController.postBooking);
// memberikan konfirmasi booking karena sudah melakukan pembayaran
router.post('/booking/confirm', BookingController.confirmBooking);

module.exports = router;