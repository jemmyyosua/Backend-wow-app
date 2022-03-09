const express = require('express')

const path = require('./src/routes')

const exp = express()

const port = 4000

exp.use(express.json())

// Add endpoint grouping and routing
exp.use('/wow-app', path)

exp.listen(port , () => console.log(`Server Running on port ${port}`))