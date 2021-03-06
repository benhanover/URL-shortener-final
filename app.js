require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const fetch = require("node-fetch");
let urlencodedParser = bodyParser.urlencoded({ extended: false });
const DataBase = require("./DataBase/database.js");
const dataBase = new DataBase();

app.use(cors());

app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new", urlencodedParser, (req, res) => {
  url = req.body.url;
  desiredLink = req.body.askedShorten;
  fetch(url)
  .then(() => {
    dataBase.findLink(url)
    .then((found) => {
      if (found) {
        return res.send({
          original_url: found.original_url,
          shorten_url: found.shorten_url
          });
      } else {
    dataBase.addLink(url, desiredLink)
      .then((shortenUrlObj) => {
        if (shortenUrlObj) {
          if(shortenUrlObj.error !== undefined) {
            // console.log("im in the if");
            return res.send(shortenUrlObj);
          } else {
            // console.log("im in the else");
            return res.send({
              original_url: shortenUrlObj.original_url,
              shorten_url: shortenUrlObj.shorten_url
            });
          }
        }
      });
      }
    });
  })
  .catch((e) =>{
    return res.status(400).send({error: "invalid URL"});
  });
 
});

app.get("/api/statistic/:id", (req, res) => {
  const { id } = req.params;
  dataBase.getLinks()
  .then((data) => {
    const urls = data;
    for (const url of urls) {
      if (url.shorten_url === id) {
        return res.status(200).send(url);
      }
    }
  }).catch((e) => {return res.status(400).json("Cannot find id in our system")});
});

app.get("/api/statistics", (req, res) => {
  dataBase.getLinks()
  .then((data) => {
    return res.json(data);
  });
});




app.get("/:id", (req, res) => {
  const { id } = req.params;
  dataBase.getLinks()
  .then((data) => {
    const urls = data;
    const index = urls.findIndex((url) => {return url.shorten_url === id;});
    if (index === -1) {
      return res.status((400).json("Cannot find id in our system"));
    }
    urls[index].clicks++;
    dataBase.save()
    .then(() => {
      return res.redirect(303, urls[index].original_url);
    }).catch((e) => {return res.status(500).json('There was some trouble: ' + e)});
  });
});


app.get("/reset/666",async (req, res) => {
  await dataBase.reset();
  return res.status(200).json("reseted succefully");
});
module.exports = { dataBase };
module.exports = app;
