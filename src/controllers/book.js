// Import db connection and QueryTypes from sequelize
const db = require("../database/connection")
const { QueryTypes } = require("sequelize")

// Function addbooks for insert book data to database
exports.addBooks = async (req, res) => {
    try {
        const { title, publicationDate, pages, author, ISBN, about, bookFile } = req.body
        const query = `INSERT INTO books (title, publicationDate, pages, author, ISBN, about, bookFile) 
        VALUES ('${title}','${publicationDate}',${pages},'${author}',${ISBN},'${about}','${bookFile}')`

        await db.sequelize.query(query)

        res.send({
            status: "You added a book",
            message: "Add book finished",
            data : {book:{query}},
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
        const query = "SELECT * FROM books"
        const select = await db.sequelize.query(query, { type: QueryTypes.SELECT })

        res.send({
            status: "success",
            data :{ books : select} ,
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

        const select = await db.sequelize.query(
            `SELECT * FROM books WHERE id = ${id} `,
            { type: QueryTypes.SELECT }
        )
        
        res.send({
            status: "Success",
            data : {book:{select}},
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

        const { title } = req.body;

        const query = `UPDATE books 
                        SET title = '${title}'
                        WHERE id = ${id}`;

        const select = await db.sequelize.query(
            `SELECT * FROM books WHERE id = '${id}' `,
            { type: QueryTypes.SELECT }
        )

        await db.sequelize.query(query);

        res.send({
            status: "Success update book",
            message: `Update book id: ${id}`,
            data: {book:select},
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

        const query = `DELETE FROM books WHERE id = ${id}`

        await db.sequelize.query(query)

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
