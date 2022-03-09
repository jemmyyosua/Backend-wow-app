// Import db connection and QueryTypes from sequelize
const db = require("../database/connection")
const { QueryTypes } = require("sequelize")

// Function addUsers for insert user data to database
exports.addUsers = async (req, res) => {
    try {
        const { email, password, fullName, role } = req.body
        const query = `INSERT INTO users (email,password,fullName,role) VALUES ('${email}','${password}','${fullName}','${role}')`

        await db.sequelize.query(query)

        res.send({
            status: "You created your account",
            message: "Add user finished",
            data : {user:{email}},
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
        const query = "SELECT * FROM users"
        const select = await db.sequelize.query(query, { type: QueryTypes.SELECT })

        res.send({
            status: "success",
            data :{ users : select} ,
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
        const { email, password } = req.body

        const data = await db.sequelize.query(
            `SELECT email FROM users WHERE email = '${email}' AND password = '${password}' `,
            { type: QueryTypes.SELECT }
        )
        
        if (data == ""){
            throw Error
        }
        
        res.send({
            status: "Login Success",
            data : {user:{email}},
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

        const query = `DELETE FROM users WHERE id = ${id}`

        await db.sequelize.query(query)

        res.send({
            status: "Your account deleted",
            data :{id},
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed to delete user",
            message: "Server Error",
        })
    }
}
