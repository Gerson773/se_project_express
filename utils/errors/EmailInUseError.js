class EmailInUseError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailInUseError";
    this.statusCode = 400;
  }
}

module.exports = { EmailInUseError };
