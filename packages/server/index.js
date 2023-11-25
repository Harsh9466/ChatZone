const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: "./config.env" });
app.use(cors());

app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});
