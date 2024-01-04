const router = require("express").Router();
const UserRouter = require("./users");
const clothingItems = require("./clothingItems");

router.use("/items", clothingItems);
router.use("/users", UserRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
