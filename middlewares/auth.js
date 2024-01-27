const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED, ERROR_MESSAGES } = require("../utils/constants");

const handleAuthError = (res) => {
  res.status(UNAUTHORIZED).send({ message: ERROR_MESSAGES.FORBIDDEN });
};

const extractBearerToken = (header) => header.replace("Bearer", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError();
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError();
  }

  req.user = payload;

  return next();
};
