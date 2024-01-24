class PasswordRequired extends Error {
  constructor(message) {
    super(message);
    this.name = "PasswordRequired";
    this.statusCode = 404;
  }
}

module.exports = { PasswordRequired };
