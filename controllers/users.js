const User = require("../models/user");
const {
  ValidationError,
  InternalServerError,
  NotFoundError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === InternalServerError) {
        return res.status(err.statusCode).send({ message: err.message });
      } else {
        console.error("Unexpected error:", err);
        res.status(500).send({ message: "An unexpected error occurred" });
      }
    });
};

const getUser = (req, res) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }

      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      } else {
        console.error("Unexpected error:", err);
        res.status(500).send({ message: "An unexpected error occurred" });
      }
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
      if (err.name === ValidationError) {
        return res.status(err.statusCode).send({ message: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .send({ message: "An error has occurred on the Server Error", err });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
