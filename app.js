require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
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
  // console.log(url);
  dataBase.findLink(url)
  .then((found) => {
    if (found) {
      res.send(found);
    } else {
      dataBase.addLink(url)
      .then((shortenUrlObj) => {
        if (shortenUrlObj) {
          res.send(shortenUrlObj);
        }
      });
    }
  });
});

app.get("/:shorten", (req, res) => {
  const { shorten } = req.params;
  dataBase.getLinks()
  .then((data) => {
    const urls = data;
    console.log("urls:")
    console.log(urls)
    console.log("shorten:")
    console.log(shorten);
  
    for (const url of urls) {

      if (url.shorten_url === shorten) {
        console.log(url.original_url);
        res.redirect(301, url.original_url);
      }
    }
  });
});


module.exports = app;
