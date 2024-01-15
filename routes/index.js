const router = require("express").Router();
const UserRouter = require("./users");
const clothingItems = require("./clothingItems");
const { NOT_FOUND, ERROR_MESSAGES } = require("../utils/constants");

router.use("/items", clothingItems);
router.use("/users", UserRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
});

module.exports = router;
