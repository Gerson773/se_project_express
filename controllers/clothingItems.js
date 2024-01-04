const ClothingItem = require("../models/clothingItem");

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
    .catch((e) => {
      res.status(500).send({ messsage: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Getting items failed", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: "Updating items failed", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      res.status(500).send({ message: "Deleting items failed", e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
