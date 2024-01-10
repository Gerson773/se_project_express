const ClothingItem = require("../models/clothingItem");
const ItemNotFoundError = require("../utils/errors");

module.exports.likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === ItemNotFoundError) {
        return res.status(404).send({ message: "Item not found" });
      } else {
        console.error(err);
        res
          .status(500)
          .send({ message: "An error has occurred on the server", error });
      }
    });

module.exports.dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === ItemNotFoundError) {
        return res.status(404).send({ message: "Item not found" });
      } else {
        console.error(err);
        res
          .status(500)
          .send({ message: "An error has occurred on the server", error });
      }
    });
