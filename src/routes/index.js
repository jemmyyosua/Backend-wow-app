const express = require('express')
const path = express.Router()

const { auth } = require('../../middleware/authentication')
const {uploadImage} = require('../../middleware/uploadImage')

// Controller User
const {
    getUsers,
    getUser,
    login,
    register,
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
path.post("/register", register)
path.post("/login", login)
path.get("/users", getUsers)
path.get("/user", auth,getUser)
path.delete("/user/:id", deleteUser)

// Route Book
path.post("/add-book", uploadImage("bookFile"), addBooks)
path.get("/books", getBooks)
path.get("/book/:id", auth, getBook)
path.patch("/update-book/:id", uploadImage("bookFile"), updateBook)
path.delete("/book/:id", deleteBook)

// Route Transaction
path.post("/add-transaction", addTransactions)
path.get("/transactions", getTransactions)
path.get("/transaction/:id", getTransaction)
path.patch("/update-transaction/:id", updateTransaction)

// export module route
module.exports = path
