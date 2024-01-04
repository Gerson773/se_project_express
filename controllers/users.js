const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      res.status(500).send({ message: "Getting users failed", e });
    });
};

const getUser = (req, res) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send(user);
    })
    .catch((e) => {
      res.status(500).send({ message: "Getting user failed", e });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      res.status(500).send({ message: "Creating user failed", e });
    });
};

module.exports = { getUsers, getUser, createUser };
