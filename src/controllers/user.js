const {user, profile, transaction,userBook, book} = require('../../models')
const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()


exports.register = async (req, res) => {
  const schema = Joi.object({
    fullName: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(16).required(),
  })

  const { error } = schema.validate(req.body)

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    })

  try {
    const salt = await bcrypt.genSalt(15)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const data = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      role: "user"
    }

    const newUser = await user.create(data)

    const trans = {
      userStatus : "Not Active",
      idUser : newUser.id
    }
    const userTransaction = await transaction.create(trans)
    
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);
    
    res.status(200).send({
      status: "success",
      data: {
        fullName: newUser.fullName,
        email: newUser.email,
        userTransaction,
        token
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    })
  }
}


exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(16).required(),
  })

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body)

  // if error exist send validation error message
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    })

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      }
    })

    // compare password between entered from client and from database
    const isValid = await bcrypt.compare(req.body.password, userExist.password)

    // check if not valid then return response with status 400 (bad request)
    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "credential is invalid",
        userExist,
      })
    }

    // generate token
    // const TOKEN_KEY = "karina2021"
    const token = jwt.sign({ id: userExist.id },  process.env.TOKEN_KEY)

    res.status(200).send({
      status: "success",
      data: {
      id: userExist.id,
      fullName : userExist.fullName,
      email : userExist.email,
      role : userExist.role,
      token
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    })
  }
}


exports.getUsers = async (req, res) => {
    try {
        const users = await user.findAll({
            include: {
              model: profile,
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
              },
            },
            attributes: {
              exclude: [ "createdAt", "updatedAt"],
            },
          })

        res.send({
            status: "success",
            data :{ users} ,
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed",
            message: "Server Error",
        })
    }
}


exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }
  
    res.send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          role: dataUser.role,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
}

exports.getUser = async (req, res) => {
  try {
    const id = req.user.id;

    const data = await user.findOne({
      where: {
        id,
      },
      include: 
        {
          model: transaction,
          as: "transaction",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "role"],
          },
        },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    })

  
    if (!data) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        await user.destroy({
            where: {
              id,
            },
          })

        res.send({
            status: "Your account deleted"
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed to delete user",
            message: "Server Error",
        })
    }
}


//User Books
exports.addList = async (req, res) => {
  try {
    let data = req.body;

    data = {
      ...data,
      idUser: req.user.id,
    };

    await userBook.create(data);

    res.send({
      status: "success",
      message: "Add transaction finished",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
}

exports.listBook = async (req, res) => {
  try {
    const idUser = req.user.id
    let data = await userBook.findAll({
      where: {
        idUser,
      },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: [
        {
          model: book,
          as: "book",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
            ],
          },
        },
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "role"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data))
    data = data.map((item) => {
      return {
        ...item,
        book: {
          ...item.book,
          cover: process.env.COVER_FILE + item.book.cover,
          bookFile: process.env.BOOK_FILE + item.book.bookFile,
        },
      };
    });

    console.log(data)
    res.send({
      status: "success",
      data

    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
}
