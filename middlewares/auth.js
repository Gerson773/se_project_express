const jwt = require("jsonwebtoken");
const { AuthorizationError } = require("../utils/errors/AuthorizationError");
const { JWT_SECRET } = require("../utils/config");

const handleAuthError = () => {
  throw new AuthorizationError("Authorization Error");
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
