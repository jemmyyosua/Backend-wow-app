// Import db connection and QueryTypes from sequelize
const {user, profile} = require('../../models')

// Function addUsers for insert user data to database
exports.addUsers = async (req, res) => {
    try {
       
        await user.create(req.body)

        res.send({
            status: "You created your account",
            message: "Add user finished",
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed to create account",
            message: "Server Error",
        })
    }
}

// Function getUsers for get all user data from database
exports.getUsers = async (req, res) => {
    try {
      
        const users = await user.findAll()

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

// Function getUser for get one user data from database
exports.postUser = async (req, res) => {
    try {

       const {email,password} = req.body
       const dataUser = await user.findOne({ 
        where: {
        email, 
        password,
         }, attributes: {
            exclude: ["id","fullName", "createdAt", "updatedAt"],
          }})

        
        res.send({
            status: "Login Success",
            data : {dataUser},
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed to login",
            message: "Server Error",
        })
    }
}


// Create controller delete User here ...
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
