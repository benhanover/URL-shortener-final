require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const fetch = require("node-fetch");
let urlencodedParser = bodyParser.urlencoded({ extended: false });


// // class
const DataBase = require("./DataBase/database.js");
// // // object
const dataBase = new DataBase();

app.use(cors());
// app.use(express.json());

app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});


app.post("/api/shorturl/new", urlencodedParser, (req, res) => {
  url = req.body.url;
  fetch(url).catch((e) =>{
    res.send({error: "invalid URL"});
  });
  dataBase.findLink(url)
  .then((found) => {
    if (found) {
      res.send({
        original_url: found.original_url,
        shorten_url: found.shorten_url
      });
    } else {
      dataBase.addLink(url)
      .then((shortenUrlObj) => {
        if (shortenUrlObj) {
          res.send({
            original_url: shortenUrlObj.original_url,
            shorten_url: shortenUrlObj.shorten_url
          });
        }
      });
    }
  });
});


// browser is remembering the url and so it only gets inside here the first time
// problem with save
app.get("/:id", (req, res) => {
  console.log("im here");
  const { id } = req.params;
  dataBase.getLinks()
  .then(async (data) => {
    const urls = data;
    for (const url of urls) {
      if (url.shorten_url === id) {
        console.log(url.clicks);
        url.clicks++;
        console.log(url.clicks);
        await dataBase.save();
        res.redirect(301, url.original_url);
      }
    }
  });
});

app.get("/api/statistic/:id", (req, res) => {
  const { id } = req.params;
  dataBase.getLinks()
  .then((data) => {
    const urls = data;
    for (const url of urls) {
      if (url.shorten_url === id) {
        res.send(url);
      }
    }
  });
});


module.exports = app;
