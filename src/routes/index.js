const express = require('express')

const path = express.Router()

// Controller User
const {
    getUsers,
    postUser,
    addUsers,
    deleteUser
  } = require("../controllers/user")

// Controller Book
  const {
    getBooks,
    getBook,
    addBooks,
    updateBook,
    deleteBook
  } = require("../controllers/book")

// Controller Transaction
  const {
    getTransactions,
    getTransaction,
    addTransactions,
    updateTransaction
  } = require("../controllers/transaction")


// Route User
path.post("/register", addUsers)
path.get("/users", getUsers)
path.post("/login", postUser)
path.delete("/user/:id", deleteUser)

// Route Book
path.post("/add-book", addBooks)
path.get("/books", getBooks)
path.get("/book/:id", getBook)
path.patch("/update-book", updateBook)
path.delete("/book/:id", deleteBook)




module.exports = path
