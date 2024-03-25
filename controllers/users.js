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
  DUPLICATE_EMAIL,
} = require("../utils/constants");
const { EmailInUseError } = require("../utils/errors/EmailInUseError");
const { generateToken } = require("../utils/config");

const createUser = (req, res, next) => {
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
        next(new BAD_REQUEST(ERROR_MESSAGES.VALID_EMAIL_REQUIRED));
      } else if (err.message === ERROR_MESSAGES.EMAIL_ALREADY_IN_USE) {
        next(new DUPLICATE_EMAIL(ERROR_MESSAGES.VALIDATION_ERROR));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.PASSWORD_REQUIRED });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken(user);
      return res.status(OK).send({ token, user });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UNAUTHORIZED(ERROR_MESSAGES.PASSWORD_REQUIRED));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
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
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST(ERROR_MESSAGES.VALIDATION_ERROR));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
