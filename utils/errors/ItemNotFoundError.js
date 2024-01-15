class ItemNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "ItemNotFoundError";
    this.statusCode = 404;
  }
}

module.exports = { ItemNotFoundError };
