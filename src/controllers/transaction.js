// Import db connection and QueryTypes from sequelize
const { transaction, user, book } = require("../../models")

// Function addtransactions for insert transaction data to database
exports.addTransactions = async (req, res) => {
    try {
        const data = {
            transferProof : req.file.filename,
            idUser : req.user.id,
        }
        const add = await transaction.create(data)

        res.send({
            status: "success",
            message: "Add transaction finished",
            transferProof: process.env.TRANSACTION_FILE + add.transferProof
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed add transaction",
            message: "Server Error",
        })
    }
}

// Function gettransactions for get all transaction data from database
exports.getTransactions = async (req, res) => {
    try {
        let data = await transaction.findAll({
            where : {
                paymentStatus : ["Pending", "Approve", "Cancel"]
            },
            include: [
              {
                model: user,
                as: "user",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "password"],
                }
              },
            ],
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          })

          data = JSON.parse(JSON.stringify(data))
          data = data.map((item) => {
            return { ...item, transferProof: item.transferProof };
          })

          console.log(data)

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

// Function gettransaction for get one transaction data from database
exports.getTransaction = async (req, res) => {
    try {
        const { id } = req.params

        const transaction = await transaction.findOne({ 
            where: {
            id,
             }, attributes: {
                exclude: ['createdAt', 'updatedAt', 'idBuyer', 'idSeller', 'idProduct']
            },
            include: [
                {
                    model: book,
                    as: 'book',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'idUser',]
                    }
                },
                {
                    model: user,
                    as: 'buyer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
                {
                    model: user,
                    as: 'seller',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
            ]})
        
        res.send({
            status: "Success",
            data : {transaction},
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: "failed",
            message: "Server Error",
        })
    }
}


// Function update transaction data from database
exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params
        const data = {
            transferProof: req?.file?.filename,
            paymentStatus: req?.body?.paymentStatus,
            remainingActive: req?.body?.remainingActive,
            userStatus: req?.body?.userStatus,
            idUser : req?.user?.id,
        }

        await transaction.update(data ,{
            where: {
              id,
            },
          })

        res.send({
            status: "success",
            message: `Update transaction id: ${id}`,
            data: {
                id,
                data,
                paymentStatus: req?.body?.paymentStatus,
                remainingActive: req?.body?.remainingActive,
                userStatus: req?.body?.userStatus,
                transferProof: req?.file?.filename,
              },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};