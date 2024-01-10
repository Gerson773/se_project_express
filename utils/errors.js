class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

class ItemNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "ItemNotFoundError";
    this.statusCode = 404;
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  InternalServerError,
  ItemNotFoundError,
};
