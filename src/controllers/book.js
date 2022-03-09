// Import db connection and QueryTypes from sequelize
const { book } = require("../../models")

// Function addbooks for insert book data to database
exports.addBooks = async (req, res) => {
    try {
        await book.create(req.body)

        res.send({
            status: "You added a book",
            message: "Add book finished",
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed add book",
            message: "Server Error",
        })
    }
}

// Function getbooks for get all book data from database
exports.getBooks = async (req, res) => {
    try {

        const books = await book.findAll()

        res.send({
            status: "success",
            data :{ books} ,
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed",
            message: "Server Error",
        })
    }
}

// Function getbook for get one book data from database
exports.getBook = async (req, res) => {
    try {
        const { id } = req.params

        const Book = await book.findOne({ 
            where: {
            id,
             }})
        
        res.send({
            status: "Success",
            data : {Book},
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed",
            message: "Server Error",
        })
    }
}

// Function update book data from database
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        
        await book.update(req.body, {
            where: {
              id,
            },
          });

        res.send({
            status: "Success update book",
            message: `Update book id: ${id}`,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};


// Create controller delete book here ...
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params

        await book.destroy({
            where: {
              id,
            },
          });

        res.send({
            status: "Book deleted",
            data :{id},
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed to delete book",
            message: "Server Error",
        })
    }
}
