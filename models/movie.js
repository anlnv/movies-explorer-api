const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator: (image) => validator.isURL(image),
      message: 'Неправильный формат ссылки',
    },
  },
  trailerLink: {
    type: String,
    require: true,
    validate: {
      validator: (trailerLink) => validator.isURL(trailerLink),
      message: 'Неправильный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator: (thumbnail) => validator.isURL(thumbnail),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    require: true,
  },
  nameRU: {
    type: String,
    require: true,
  },

  nameEN: {
    type: String,
    require: true,
  },

});

module.exports = mongoose.model('movie', movieSchema);
