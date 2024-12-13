const cors = require("cors");
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const options = {
  key: fs.readFileSync(path.resolve(__dirname, "server.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "server.cert")),
};

const app = express();

app.use(function (req, res, next) {
  res.setHeader("Ad-Auction-Allowed", "true");
  res.setHeader("Supports-Loading-Mode", "fenced-frame");
  next();
});

app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/start.html");
});

const PORT = 9999;

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Your app is listening securely on https://localhost:${PORT}`);
});
