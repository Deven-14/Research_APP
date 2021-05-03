const express = require("express");
const bodyParser = require("body-parser");
const getinfo = require("./getInfo");

const port = 4200;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) =>{
    res.render("home.ejs");
});

app.post("/user", (req, res) => {
    var n = req.body.name;
    console.log(n);
    console.log(getinfo.GetInfo(n));
    res.render("user.ejs");
});
app.listen(port, () => {
    console.log(`this log is working on ${port}`);
});