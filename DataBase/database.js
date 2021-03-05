const API_KEY = "$2b$10$Gngt6a2X5rSlrH5bkOyscea5zrXZQGieIPFU6D02.H8lZidUy7n3a"
const { application } = require('express');
const fetch = require('node-fetch');

class DataBase {
  constructor() {
    this.urls = [];
  }

  addLink(url) {
    return fetch("https://api.jsonbin.io/b/604137bc0866664b1088c824/latest")
    .then((res) => {return res.json()
    .then(async (data) => 
    {
      this.urls = data;
      let shortenUrl = new ShortUrl(url);
      
      let isUniqeId = this.urls.findIndex((url) => {
        url.shorten_url === shortenUrl.shorten_url;
      }); 
      while (isUniqeId !== -1) {
        shortenUrl = new ShortUrl(url);
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
          // add async if needed
          // urlObj.clicks++;
          // await this.save();
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
      fetch("https://api.jsonbin.io/b/604137bc0866664b1088c824", options)
      .then((res) => {
        if(!res.ok) {
          throw new Error("error in save");
        } else {
          return "Data saved succsefuly"
        }
      });
    }

    getLinks() {
      return fetch("https://api.jsonbin.io/b/604137bc0866664b1088c824/latest")
      .then((res) => {
        return res.json()
        .then((data) => {
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


