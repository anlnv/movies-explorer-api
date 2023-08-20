const router = require('express').Router();

const {
  getMovies,
  createMovies,
  deleteMovie,
} = require('../controllers/movies');

const { createMoviesValidation, deleteMovieValidation } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', createMoviesValidation, createMovies);
router.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports = router;
