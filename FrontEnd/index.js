const express = require("express");
const bodyParser = require("body-parser");

const port = 4200;

const app = express();

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("home.ejs");
});
app.listen(port, () => {
    console.log(`this log is working on ${port}`);
});