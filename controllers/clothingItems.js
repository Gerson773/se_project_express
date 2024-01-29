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

const createItem = (req, res) => {
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
        return res
          .status(BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.VALIDATION_ERROR });
      }
      return res
        .status(DEFAULT)
        .send({ messsage: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      console.error("Unexpected error:", err);
      res.status(DEFAULT).send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });
};

const deleteItem = (req, res) => {
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
        return res
          .status(NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
      }

      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
};
