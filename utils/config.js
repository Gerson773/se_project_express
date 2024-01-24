const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;

const genrateToken = (user) => {
  const token = jwt.sign(
    { _id: user._id },
    NODE_ENV === "production" ? JWT_SECRET : "secrete-key-for-now",
    { expiresIn: "7d" },
  );

  return token;
};

module.exports = { NODE_ENV, JWT_SECRET, genrateToken };
