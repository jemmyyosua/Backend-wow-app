const {user, profile, book} = require('../../models')
const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()


exports.register = async (req, res) => {
  const schema = Joi.object({
    fullName: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(16).required(),
    role : Joi.string()
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

    const newUser = await user.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role
    })

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);
    
    res.status(200).send({
      status: "success",
      data: {
        fullName: newUser.fullName,
        email: newUser.email,
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
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser"],
        },
      }, 
    
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      }
    })

    const findBooks = await user.findOne({
      where: {
        id : userExist.id
      },
      include: {
        model: book,
        as: "book",
        attributes: {
          exclude: ["id","createdAt", "updatedAt", "idUser"],
        },
      }, 
      attributes: {
        exclude: ["id","createdAt", "updatedAt"],
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
    const token = jwt.sign({ id: user.id },  process.env.TOKEN_KEY)

    res.status(200).send({
      status: "success",
      data: {
      fullName : userExist.fullName,
      email : userExist.email,
      role : userExist.role,
      profile : userExist.profile,
      book : findBooks.book,
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


exports.getUser = async (req, res) => {
    try {
      const id = req.user.id
  
      const data = await user.findOne({
        where: {
          id,
        },
        include: {
          model: profile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser"],
          },
        },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      })

      if (!data) {
        return res.status(404).send({
          status: "failed",
        });
      }  
  
      res.send({
        status: "success",
        data: {
          user: {
            id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
          }
        },
      })
    } catch (error) {
      console.log(error)
      res.send({
        status: "failed",
        message: "Server Error",
      })
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
