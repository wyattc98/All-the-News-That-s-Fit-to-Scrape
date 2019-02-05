const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("morgan")
const db = require("./models")

const PORT = 3000;

const app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/hwscraperdb", { useNewUrlParser: true});

//ADD Routes