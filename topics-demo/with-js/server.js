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
  res.setHeader("Foo-Bar", "Baz");
  next();
});

app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/observe/site.html");
});

app.get("/start", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/send-topics", (req, res) => {
  const requestInfo = {
    protocol: req.protocol,
    host: req.get("host"),
    path: req.path,
  };

  console.log("Request", requestInfo);
  console.log("Headers: ", req.headers);
  res.json(req.headers);
});

const PORT = 443;

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Your app is listening securely on https://localhost:${PORT}`);
});
