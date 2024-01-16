const User = require("../models/user");
const {
  DEFAULT,
  ERROR_MESSAGES,
  OK,
  NOT_FOUND,
  BAD_REQUEST,
} = require("../utils/constants");

const { NotFoundError } = require("../utils/errors/NotFoundError");

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
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.VALIDATION_ERROR });
      }
      return res
        .status(DEFAULT)
        .send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });
};

module.exports = { getUsers, getUser, createUser };
