const ClothingItem = require("../models/clothingItem");
const {
  OK,
  NOT_FOUND,
  ERROR_MESSAGES,
  DEFAULT,
  BAD_REQUEST,
} = require("../utils/constants");
const { ItemNotFoundError } = require("../utils/errors/ItemNotFoundError");

module.exports.likeItem = (req, res, next) =>
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
        next(new NotFoundError(ERROR_MESSAGES.UNEXPECTED_ERROR));
      } else if (err.name === "CastError") {
        next(new BadRequestError(ERROR_MESSAGES.INVALID_ID_FORMAT));
      } else {
        next(err);
      }
    });

module.exports.dislikeItem = (req, res, next) =>
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
        next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      } else if (err.name === "CastError") {
        next(new BadRequestError(ERROR_MESSAGES.INVALID_ID_FORMAT));
      } else {
        next(err);
      }
    });
