const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const clothingItemSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  weather: Joi.string().valid("hot", "warm", "cold").required(),
  imageUrl: Joi.string().uri().required(),
});

const validateClothingItem = (data) => {
  return clothingItemSchema.validate(data);
};

const userSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  avatar: Joi.string().uri(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});

const validateUser = (data) => {
  return userSchema.validate(data);
};

const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});

const authenticateUser = (data) => {
  return loginSchema.validate(data);
};

const userIdSchema = Joi.string().length(24).hex();

const validateUserId = (userId) => {
  return userIdSchema.validate(userId);
};

const clothingItemIdSchema = Joi.string().length(24).hex();

const validateClothingItemId = (clothingItemId) => {
  return clothingItemIdSchema.validate(clothingItemId);
};

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "any.required": 'The "weather" field must be filled in',
      "any.only": 'The "weather" field must be one of "hot", "warm", or "cold"',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),

    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email address',
    }),

    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateUserAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateUserUpdateBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "Avatar" field must be filled in',
      "string.uri": 'the "Avatar" field must be a valid url',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).messages({
      "string-hex": "ID must be hexadecimal string",
      "string-lenght": "ID must be 24 characters in lenght",
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUser,
  authenticateUser,
  validateUserId,
  validateClothingItemId,
  validateURL,
  validateUserBody,
  validateUserAuthentication,
  validateClothingItemBody,
  validateId,
  validateUserUpdateBody,
};
