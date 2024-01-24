const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  DEFAULT,
  ERROR_MESSAGES,
  OK,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  UNAUTHORIZED,
} = require("../utils/constants");
const { EmailInUseError } = require("../utils/errors/EmailInUseError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { generateToken } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      console.error("Unexpected error:", err);
      res.status(DEFAULT).send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }

      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID_FORMAT });
      }
      if (err instanceof NotFoundError) {
        return res
          .status(NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      console.error("Unexpected error getting User:", err);
      return res
        .status(DEFAULT)
        .send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_ID_FORMAT });
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new EmailInUseError("Email is already in use");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const payload = user.toObject();
      delete payload.password;
      return res.status(CREATED).send({ data: payload });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: ERROR_MESSAGES.VALID_EMAIL_REQUIRED,
        });
      }

      if (err.message === ERROR_MESSAGES.EMAIL_ALREADY_IN_USE) {
        return res
          .status(BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.VALIDATION_ERROR });
      }
      return res
        .status(DEFAULT)
        .send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.PASSWORD_REQUIRED });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken(user);
      return res.status(OK).send({ token });
    })
    .catch((err) => {
      console.error("Unexpected error:", err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: ERROR_MESSAGES.PASSWORD_REQUIRED });
      }
      return res
        .status(DEFAULT)
        .send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });
};

const getCurrentUser = (req, res) => {
  const currentUser = req.user;
  if (!currentUser) {
    return res.status(NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
  }
  return res.status(OK).send(currentUser);
};

// controllers/users.js

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      const updatedUser = user.toObject();
      delete updatedUser.password;
      return res.status(OK).send(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
