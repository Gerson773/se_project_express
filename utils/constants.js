const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const DEFAULT = 500;

const ERROR_MESSAGES = {
  VALIDATION_ERROR: "Validation error",
  DUPLICATE_KEY_ERROR: "Duplicate key error",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  REQUEST_SUCCESSFUL: "Request Succesful",
  INVALID_ID_FORMAT: "Invalid ID Format",
  NOT_FOUND: "Resource not found",
};

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  ERROR_MESSAGES,
};
