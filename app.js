require("dotenv").config();
const express = require("express");

const errorHandler = require("./middlewares/error-handler");

const mongoose = require("mongoose");

const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

const routes = require("./routes");
const { createUser, login } = require("./controllers/users");

app.use(express.json());
app.use(cors());

const { errors } = require("celebrate");

app.post("/signin", login);
app.post("/signup", createUser);

const { requestLogger, errorLogger } = require("./middlewares/logger");

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("Testing server");
});
