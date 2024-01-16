const ClothingItem = require("../models/clothingItem");
const {
  OK,
  NOT_FOUND,
  ERROR_MESSAGES,
  DEFAULT,
  BAD_REQUEST,
} = require("../utils/constants");
const ItemNotFoundError = require("../utils/errors/ItemNotFoundError");

module.exports.likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        throw new ItemNotFoundError("Item not found");
      }
      res.status(OK).send({ data: item });
    })

    .catch((err) => {
      if (err instanceof ItemNotFoundError) {
        return res
          .status(NOT_FOUND)
          .send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
      }

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID_FORMAT });
      }

      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });

module.exports.dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        throw new ItemNotFoundError("Item not found");
      }
      res.status(OK).send({ data: item });
    })
    .catch((err) => {
      if (err instanceof ItemNotFoundError) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID_FORMAT });
      }
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
    });
