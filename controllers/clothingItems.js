const ClothingItem = require("../models/clothingItem");
const {
  NotFoundError,
  ValidationError,
  InternalServerError,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  if (!ownerId) {
    return res.status(400).send({ message: "Owner ID is required" });
  }

  ClothingItem.create({ name, weather, imageURL, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new ValidationError("Validation error: " + err.message);
      } else if (e.name === "MongoError" && err.code === 11000) {
        throw new InternalServerError("Duplicate key error");
      } else {
        console.error("Error from createItem:", e);
        throw new InternalServerError("Error from createItem");
      }
    })
    .catch((e) => {
      res.status(500).send({ messsage: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      if (err.name === InternalServerError) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        console.error("Unexpected error:", e);
        res.status(500).send({ message: "An unexpected error occurred", e });
      }
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } }, { new: true })
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === NotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .send({ message: "An error has occurred on the server", err });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => res.status(204).send(item))
    .catch((err) => {
      if (err.name === NotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .send({ message: "An error has occurred on the server", err });
      }
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageURL } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((e) => {
//       res.status(500).send({ message: "Updating items failed", e });
//     });
// };

// const deleteItem = (req, res) => {
//   const { itemId } = req.params;

//   console.log(itemId);
//   ClothingItem.findByIdAndDelete(itemId)
//     .orFail()
//     .then((item) => res.status(204).send(item))
//     .catch((e) => {
//       res.status(500).send({ message: "Deleting items failed", e });
//     });
// };

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
