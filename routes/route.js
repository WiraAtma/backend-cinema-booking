const express = require('express');
const router = express.Router();
const FilmController = require('../controller/FilmController');

router.get('/films', FilmController.getFilm);

module.exports = router;