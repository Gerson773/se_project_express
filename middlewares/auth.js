const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED, ERROR_MESSAGES } = require("../utils/constants");

const handleAuthError = (res) => {
  res.status(UNAUTHORIZED).send({ message: ERROR_MESSAGES.FORBIDDEN });
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "secrete-key-for-now",
    );
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
