// Import db connection and QueryTypes from sequelize
const { book, user } = require("../../models")

// Function addbooks for insert book data to database
exports.addBooks = async (req, res) => {
    try {
        const {...data} = req.body
        await book.create({
            ...data,
            bookFile: req.file.filename,
        })

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
        let books = await book.findAll({
            include: [
              {
                model: user,
                as: "user",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "password"],
                }
              }
            ],
            attributes: {
              exclude: ["createdAt", "updatedAt", "idUser"],
            },
          });
      

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
        let { id } = req.params

        const Book = await book.findOne({ 
            where: {
            id,
             },
             include: [
                {
                  model: user,
                  as: "user",
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "password"],
                  }
                }
              ],
              attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
              },
            })
             
        
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
        const { id } = req.params

    
         await book.update({bookFile : req.file.filename},{
            where: {
              id,
            },
           
          })

        file = await book.findOne({
            where: {
              id,
            },
           
          })

        file = JSON.parse(JSON.stringify(file))
        res.send({
            status: "Success update book",
            message: `Update book id: ${id}`,
            bookFile: 'http://localhost:4000/uploads/' + file.bookFile
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
          })

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
