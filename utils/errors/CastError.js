class CastError extends Error {
  constructor(message) {
    super(message);
    this.name = "CastError";
    this.statusCode = 400; // Use 400 for bad request due to invalid casting
  }
}

module.exports = {
  CastError,
};
