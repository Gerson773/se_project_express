const ClothingItem = require("../models/clothingItem");

const { NotFoundError } = require("../utils/errors/NotFoundError");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  ERROR_MESSAGES,
  FORBIDDEN,
} = require("../utils/constants");
const { ValidationError } = require("../utils/errors/ValidationError");
const { BadRequestError } = require("../utils/errors/BadRequestError");

const createItem = (req, res, next) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  if (!req.user._id) {
    return res
      .status(BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.VALIDATION_ERROR });
  }

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(CREATED).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError(ERROR_MESSAGES.VALIDATION_ERROR));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      const sortedItems = [...items].sort((a, b) => b.createdAt - a.createdAt);
      res.status(OK).send(sortedItems);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(FORBIDDEN)
          .send({ message: ERROR_MESSAGES.FORBIDDEN });
      }

      return item
        .deleteOne()
        .then(() => res.send({ message: ERROR_MESSAGES.ITEM_DELETED }));
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      } else if (err.name === "CastError") {
        next(new BadRequestError(ERROR_MESSAGES.UNEXPECTED_ERROR));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
};
