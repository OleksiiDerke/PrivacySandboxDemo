const cors = require("cors");
const express = require("express");

const app = express();

app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const PORT = 80;

const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
