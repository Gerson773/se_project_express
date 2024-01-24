const express = require("express");

const { getCurrentUser, updateUserProfile } = require("../controllers/users");

const auth = require("../middlewares/auth");

const router = express.Router();

router.use(auth);

router.get("/me", getCurrentUser);

router.patch("/me", updateUserProfile);

module.exports = router;
