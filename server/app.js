const express = require("express");
const path = require("path");
const app = new express();

// route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../src/public/index.html"));
});
console.log("connected");

// express static
app.use(express.static(path.resolve(__dirname + "/../src/public")));

// open Express Web Server
app.listen(25252);
