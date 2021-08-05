const express = require("express");
const bodyParser = require("body-parser");
const getinfo = require("./getInfo");

const port = 4200;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.post("/user", (req, res) => {
  var name = req.body.name;
  console.log(name);
  console.log(getinfo.GetInfo(name, getinfo.get_data));
  res.render("user", {
    Name: name,
    Email: req.body.email,
    img: req.body.gimage,
  });
});
app.listen(port, () => {
  console.log(`this log is working on ${port}`);
});
