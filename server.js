const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("morgan")
const db = require("./models")

const PORT = 8080 || process.env.PORT;

const app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/hwscraperdb";

mongoose.connect(MONGODB_URI);

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/hwscraperdb", { useNewUrlParser: true });

app.get("/", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        let hbsObject = {
            articles: dbArticle
        }
      res.render("index", hbsObject );
    });  })

app.get("/Scrape", function (req, res) {
    axios.get("https://www.ign.com/").then(function (response) {
    var $ = cheerio.load(response.data);

    console.log("*****************");

        $("section article").each(function(i, element) {
            var result = {};

            result.title = $(this)
              .children("a")
              .text()
              .trim();
            result.link = $(this)
              .children("a")
              .attr("href")

            db.Article.create(result)
             .then(function(dbArticle){
                 console.log(dbArticle)
             })
             .catch(function(err){
                 console.log(err)
             })
        });
        res.send("Scrape Complete press back button in Browser for Results!")
        res.redirect("/")
    });
});

app.get("/Article", function(req, res){
    db.Article.find({})
    .then(function (dbArticle) {
        res.json(dbArticle)
    })
    .catch(function (err) {
        res.json(err)
    });
})

app.listen(process.env.PORT, function () {
    console.log("Listening on port: " + PORT + "!")
});

app.get("/Saved", function(req, res){
    db.Article.find({ saved: true })
    .then(function(dbArticle){
        res.render("saved", { articles: dbArticle})
    });
});