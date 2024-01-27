const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const { ValidationError } = require("../utils/errors/ValidationError");

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "URL is required"],
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "You Must Enter a valid email",
    },
  },
  password: { type: String, required: true, select: false },
});

User.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new ValidationError("Incorrect email or password");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new ValidationError("Incorrect email or password");
        }

        return user;
      });
    });
};

module.exports = mongoose.model("User", User);
