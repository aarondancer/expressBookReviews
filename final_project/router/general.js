const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username)) {
    return res.status(401).json({ message: "username is already taken" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "Successfully registered" });
});

function getAllBooks() {
  return new Promise((res, rej) => {
    res(Object.values(books));
  })
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getAllBooks().then(result => res.status(200).json(result));
});

function getBookByIsbn(isbn) {
  return new Promise((res, rej) => {
    const book = books[isbn];
    if (book) res(book);
    rej();
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  getBookByIsbn(req.params.isbn).then(book => {
    return res.status(200).json(book);
  })
    .catch(() => {
      res.status(404).json({ message: "Unable to find book" })
    })
});

function getBooksByAuthor(author) {
  return new Promise((res) => res(Object.values(books).filter(book => book.author === author)))
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  return getBooksByAuthor(req.params.author).then(result => res.status(200).json(result));
});

function getBooksByTitle(title) {
  return new Promise((res) => res(Object.values(books).filter(book => book.title === title)))
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  return getBooksByTitle(req.params.title).then(result => res.status(200).json(result));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const book = books[req.params.isbn];
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
