const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, SECRET_SIGNING_KEY } = require('../utils/constants');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const updateUserInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(
          'Переданы некорректные данные при создании пользователя',
        ));
      } else if (err.code === 11000) {
        next(new ConflictError(
          'Пользователь с таким электронным адресом уже существует',
        ));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданные данные некорректны'));
        return;
      } if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким электронным адресом уже существует'));
        return;
      }
      console.log(err);
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new UnauthorizedError('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((validUser) => {
          if (validUser) {
            const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? SECRET_SIGNING_KEY : 'dev-secret', { expiresIn: '7d' });
            res.send({ token });
          } else {
            throw new UnauthorizedError('Передан неверный логин или пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  updateUserInfo,
  createUser,
  login,
};
