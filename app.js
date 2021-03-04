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
  const found = dataBase.addLink(req.body.url)
  .then((response) => res.send(response));
  // .then((res) => res.json()
  // .then((data) => console.log(data))
  // );
  // console.log(found);
  // res.send(found);


  
  // // if (found) {
  // //   res.send(found);
  // }

  // dataBase.findLink(req.body.blabla)
  // .then((req) => {req.json()
  // .then((data) => {
  //   const found = data;
  //   if (found) {
  //     res.send(found);
  //   } else {
  //     dataBase.addLink(req.body)
  //     .then((res) => res.json()
  //     .then((data) => {
  //       res.send(data);
  //     })
  //     ).catch((e) => {res.send(e)});
  //   }
  // });
  // });
});


module.exports = app;
