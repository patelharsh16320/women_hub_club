const express = require("express");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Women Hub API Running 🚀");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;
