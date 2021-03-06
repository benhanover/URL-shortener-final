const API_KEY = "$2b$10$Gngt6a2X5rSlrH5bkOyscea5zrXZQGieIPFU6D02.H8lZidUy7n3a"
const { application } = require('express');

// // const databaseFile = process.env.NODE_ENV === 'test' ? './backend/testdata.json':'./backend/data.json';
// // console.log("this is the state: " , process.env.NODE_ENV);
// const url = "https://api.jsonbin.io/b/604137bc0866664b1088c824/latest";
// // const url = process.env.NODE_ENV === 'test' ? "https://api.jsonbin.io/b/604137bc0866664b1088c824" : "https://api.jsonbin.io/b/6043a019683e7e079c465018";

// now everything works lalalalala

const fetch = require('node-fetch');

class DataBase {
  constructor() {
    this.urls = [];
  }

  addLink(url, desiredLink) {
    // fetch the array
    return fetch("https://api.jsonbin.io/b/604137bc0866664b1088c824/latest")
    .then((res) => {return res.json()
    .then(async (data) => 
    {
      this.urls = data;
      let shortenUrl = new ShortUrl(url);
      // checks if client want a specific url
      if (desiredLink) {
        shortenUrl.shorten_url = desiredLink;
      }
      let isUniqeId = this.urls.findIndex(url => url.shorten_url === desiredLink);
      if (isUniqeId !== -1) {
        return {error: "name is already taken"};
      }
      // make sure to bring uniqe id
      if (!desiredLink)
      {
        while (isUniqeId !== -1) {
          shortenUrl = new ShortUrl(url);
        }
      }
      this.urls.push(shortenUrl);
      await this.save();
      return shortenUrl;
    });
   });
  }
  
   findLink (searchedUrl) {
    return fetch("https://api.jsonbin.io/b/604137bc0866664b1088c824/latest")
    .then ((res) => {return res.json()
    .then((data) =>  
    {
      this.urls = data;
      for (const urlObj of this.urls) {
        if (urlObj.original_url === searchedUrl) {
          return urlObj;
        }
      }
      return false;
    });
    });
    }

    save() {

      const options = {
        method: "PUT",
        headers : {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.urls)
      }
      return fetch("https://api.jsonbin.io/b/604137bc0866664b1088c824", options)
      .then((res) => {
        if(!res.ok) {
          throw new Error("error in save");
        } else {
          return "Data saved succsefuly"
        }
      });
    }

    reset() {
      const options = {
        method: "PUT",
        headers : {
          "Content-Type": "application/json"
        },
        body: JSON.stringify([{
          "original_url": "https://www.gotchacap.com/",
          "shorten_url": "testMe:)",
          "createdAt": "2021-03-05 16:00:29",
          "clicks": 0
        }])
      }
      fetch("https://api.jsonbin.io/b/604137bc0866664b1088c824", options)
      .then((res) => {
        if(!res.ok) {
          throw new Error("error in reset");
        } else {
          return "reset succsefuly"
        }
      });
    }


    getLinks() {
      return fetch("https://api.jsonbin.io/b/604137bc0866664b1088c824/latest")
      .then((res) => {
        return res.json()
        .then((data) => {
          this.urls = data;
          return data;
        });
      });
  }
}
    

class ShortUrl {
  constructor(url) {
    this.original_url = url;
    this.shorten_url = this.newID();
    this.createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    this.clicks = 0;
  }

  newID() {
    const possible = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = "";
    
    for (let i = 0; i < 5; i++) {
      id += possible[Math.floor(Math.random() * 62)];
    }
    return id;
  }
}
module.exports = DataBase;


