const { DEFAULT, NOT_FOUND, ERROR_MESSAGES } = require("../utils/constants");
const { ItemNotFoundError } = require("../utils/errors/ItemNotFoundError");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const { statusCode = DEFAULT, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === DEFAULT ? "An error occurred on the server" : message,
  });
};

module.exports = errorHandler;
