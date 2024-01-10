const express = require("express");
const userRoutes = require("./routes/users");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.use("/users", userRoutes);

app.use((req, res, next) => {
  req.user = {
    _id: "65978d66ae28e0ffac73ec97",
  };
  next();
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("Testing server");
});
