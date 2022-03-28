const express = require('express')
const path = express.Router()

const { auth } = require('../../middleware/authentication')
const {uploudBook, uploadTransaction} = require('../../middleware/uploadImage')

// Controller User
const {
    getUsers,
    checkAuth,
    login,
    register,
    deleteUser,
    getUser,
    addList,
    listBook,
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
    updateTransaction,
    setTrans
  } = require("../controllers/transaction")


// Route User
path.post("/register", register)
path.post("/login", login)
path.get("/users", getUsers)
path.get("/check-auth", auth, checkAuth)
path.get("/user", auth, getUser)
path.delete("/user/:id", deleteUser)

//User Books
path.post("/add-list", auth, addList)
path.get("/list-book", auth, listBook)

// Route Book
path.post("/add-book", auth, uploudBook("cover", "bookFile"), addBooks)
path.get("/books", auth, getBooks)
path.get("/book/:id", auth, getBook)
path.patch("/update-book/:id", auth, uploudBook("cover", "bookFile"), updateBook)
path.delete("/book/:id", auth, deleteBook)

// Route Transaction
path.post("/add-transaction", auth, uploadTransaction("transferProof"), addTransactions)
path.get("/transactions", auth,getTransactions)
path.get("/transaction/:id", getTransaction)

// Update Transactions
path.patch("/update-transaction/:id" , auth , uploadTransaction("transferProof"), updateTransaction)
// export module route
module.exports = path
