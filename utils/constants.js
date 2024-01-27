const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const DUPLICATE_EMAIL = 409;
const DEFAULT = 500;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;

const ERROR_MESSAGES = {
  VALIDATION_ERROR: "Validation error",
  DUPLICATE_KEY_ERROR: "Duplicate key error",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  REQUEST_SUCCESSFUL: "Request Succesful",
  INVALID_ID_FORMAT: "Invalid ID Format",
  NOT_FOUND: "Resource not found",
  VALID_EMAIL_REQUIRED: "Please enter a valid email",
  EMAIL_ALREADY_IN_USE: "Email is already in use",
  PASSWORD_REQUIRED: "Password is required",
  INCORRECT_CREDENTIALS: "Incorrect email or password",
  FORBIDDEN: "Access denied",
  DUPLICATE_EMAIL: "Email address already exists",
  ITEM_DELETED: "This item has been deleted by the user",
};

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  ERROR_MESSAGES,
  UNAUTHORIZED,
  FORBIDDEN,
  DUPLICATE_EMAIL,
};
