const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  console.log(req.user._id);
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movie) => {
      if (!userId) {
        next(new NotFoundError('Фильмы не найдены'));
      } else {
        res.send(movie);
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) next(new NotFoundError('Фильм не найден'));
      else if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Попытка удалить чужую карточку');
      } else {
        movie.deleteOne()
          .then(() => res.send({ message: 'Фильм удалён' }))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovies,
};
