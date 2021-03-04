const API_KEY = "$2b$10$Gngt6a2X5rSlrH5bkOyscea5zrXZQGieIPFU6D02.H8lZidUy7n3a"
const { application } = require('express');
const fetch = require('node-fetch');

class DataBase {
  constructor() {
    this.urls = [];
  }

  addLink(url) {
    // fetching the list from jsonBin
    fetch("https://api.jsonbin.io/b/6040925281087a6a8b95f6c2")
    .then((res) => {res.json()
    .then((data) => {this.urls = data})
    });
    const shortenUrl = new ShortUrl(url);
    // adding the new link
    this.urls.push(shortenUrl);
    options = {
      method: "PUT",
      headers = {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.urls)
    }
    // sending the updated list to the jsonBin
    return fetch("https://api.jsonbin.io/b/6040925281087a6a8b95f6c2", options);
  }
  
  getLink(searchedUrl) {
    fetch("https://api.jsonbin.io/b/6040925281087a6a8b95f6c2")
    .then((res) => {res.json()
    .then((data) => {this.urls = data})
    });

    for (const shortenUrl of this.urls) {
      if (shortenUrl.longUrl === searchedUrl) {
        return shortenUrl;
      }
    }
    return "Could not find link";
    }
  }
    

class ShortUrl {
  constructor(url) {
    this.longUrl = url;
    this.id = newID();
    this.createdAt = new Date();
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
