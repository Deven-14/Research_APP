const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const get_data = require("./list_activities_new");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
