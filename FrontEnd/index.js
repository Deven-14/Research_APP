const express = require("express");
const bodyParser = require("body-parser");
const getinfo = require("./getInfo");

const port = 4200;

const app = express();

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    var n = req.body.name;
    console.log(n);
    console.log(req.body);
    var url = document.URL;
    var c = url.searchParams.get("name");
    console.log(c);
    console.log(getinfo.GetInfo(c));
    res.render("home.ejs");
});
app.listen(port, () => {
    console.log(`this log is working on ${port}`);
});