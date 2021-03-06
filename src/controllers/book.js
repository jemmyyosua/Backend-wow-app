// Import db connection and QueryTypes from sequelize
const { book, user } = require("../../models")
const cloudinary = require('../utils/cloudinary')

// Function addbooks for insert book data to database
exports.addBooks = async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'wow-app',
        use_filename: true,
        unique_filename: true,
      })

        const data = {
          title : req.body.title,
          publicationDate : req.body.publicationDate,
          pages : req.body.pages,
          about : req.body.about,
          ISBN : req.body.ISBN,
          author : req.body.author,
          cover : result.public_id,
          bookFile : result.public_id,
          idAdmin : req.user.id,
        }

        const add = await book.create(data, {include: [
          {
            model: user,
            as: "user",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          }]})

        res.send({
            status: "You added a book",
            message: "Add book finished",
            cover: process.env.PATH_FILE + add.cover,
            bookFile: process.env.PATH_FILE + add.bookFile,
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
        let data = await book.findAll({
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
          
          data = JSON.parse(JSON.stringify(data))
          data = data.map((item) => {
            return { ...item, cover: process.env.PATH_FILE + item.cover };
          })

        res.send({
            status: "success",
            data
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

        let data = await book.findOne({ 
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
             
            data = JSON.parse(JSON.stringify(data));

            data = {
              ...data,
              cover: process.env.PATH_FILE + data.cover,
              bookFile: process.env.PATH_FILE + data.bookFile
            };
             
        res.send({
            status: "Success",
            data
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
    
         await book.update({
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
            cover: process.env.PATH_FILE + file.cover
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
