const router = require("express").Router();
const { clothingItem } = require("../models");

const { likeItem, dislikeItem } = require("../controllers/likes");

// like an item
router.put("/:itemId/likes", likeItem);

//unlike an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
