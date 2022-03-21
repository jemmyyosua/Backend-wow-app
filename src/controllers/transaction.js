// Import db connection and QueryTypes from sequelize
const { transaction, user, book } = require("../../models")

// Function addtransactions for insert transaction data to database
exports.addTransactions = async (req, res) => {
    try {
        await transaction.create(req.body)

        res.send({
            status: "You added a transaction",
            message: "Add transaction finished",
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

        const transactions = await transaction.findAll()

        res.send({
            status: "success",
            data :{ transactions} ,
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
        const { id } = req.params;
        
        await transaction.update(req.body, {
            where: {
              id,
            },
          });

        res.send({
            status: "Success update transaction",
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