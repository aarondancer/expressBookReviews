const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    username: "test1",
    password: "test1"
},
{
    username: "test2",
    password: "test2"
}];

const isValid = (username) => { //returns boolean
    return !users.find(u => u.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
    const user = users.find(u => u.username === username);
    if (!user) return false;
    return (user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    if (authenticatedUser(req.body.username, req.body.password)) {
        return res.status(200).json({ token: jwt.sign(req.body.username, "secret") });
    }
    return res.status(401).json({ message: "Failed to authenticate" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];
    if (!book) {
        return res.status(404).end();
    }
    book.reviews[req.user] = req.body;
    return res.status(204).end();
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];
    if (!book) {
        return res.status(404).end();
    }
    delete book.reviews[req.user];
    return res.status(202).end();
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
