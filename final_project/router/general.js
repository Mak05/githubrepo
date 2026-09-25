const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register User
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: "Username already exists." });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1 & 10: Get all books using Promise / Async
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve) => {
    resolve(books);
  });
  getBooks.then((bookList) => {
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  }).catch(err => res.status(500).json({ message: err.message }));
});

// Task 2 & 11: Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const findBook = new Promise((resolve, reject) => {
    if (!isbn) {
      reject("ISBN parameter missing");
    } else if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  findBook
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 3 & 12: Get book details based on Author using Promise
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const findByAuthor = new Promise((resolve, reject) => {
    if (!author) {
      return reject("Author parameter missing");
    }
    const matching = Object.keys(books)
      .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
      .map(key => books[key]);

    if (matching.length > 0) {
      resolve(matching);
    } else {
      reject("No books found by this author");
    }
  });

  findByAuthor
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 4 & 13: Get book details based on Title using Promise
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const findByTitle = new Promise((resolve, reject) => {
    if (!title) {
      return reject("Title parameter missing");
    }
    const matching = Object.keys(books)
      .filter(key => books[key].title.toLowerCase() === title.toLowerCase())
      .map(key => books[key]);

    if (matching.length > 0) {
      resolve(matching);
    } else {
      reject("No books found with this title");
    }
  });

  findByTitle
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
