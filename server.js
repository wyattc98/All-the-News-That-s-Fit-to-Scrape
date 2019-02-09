const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("morgan")
const db = require("./models")

const PORT = 8080;

const app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/hwscraperdb";

mongoose.connect(MONGODB_URI);



app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/hwscraperdb", { useNewUrlParser: true });

//ADD Routes
app.get("/", function (req, res) {


    axios.get("https://www.nytimes.com/section/world").then(function (response) {
        var $ = cheerio.load(response.data)

        $("article h2").each(function(i, element) {
            var result = {};

            result.title = $(this)
                .children("a")
                .text();

            result.link = $(this)
                .children("a")
                .attr("href")

            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle)
                })
                .catch(function(err) {
                    console.log(err)
                })

        });
        res.send("Scrape Complete!")
    });
});

app.get("/Article", function(){
    db.Article.find({})
    .then(function (dbArticle) {
        res.json(dbArticle)
    })
    .catch(function (err) {
        res.json(err)
    });
})

app.listen(PORT, function () {
    console.log("Listening on port: " + PORT + "!")
});