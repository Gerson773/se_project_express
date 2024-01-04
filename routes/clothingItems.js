const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

//CRUD

//Create

router.post("/", createItem);

//read

router.get("/", getItems);

//update

router.put("/:itemId", updateItem);

//delete

router.delete("/:itemId", deleteItem);

//delete remove like

// router.delete("/items/:itemId/likes", dislikeitem);

module.exports = router;
