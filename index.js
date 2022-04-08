const express = require('express')

const path = require('./src/routes')

const exp = express()
const cors = require('cors')

const port = process.env.PORT || 5000

exp.use(express.json())
exp.use(cors())

// Add endpoint grouping and routing
exp.use('/wow-app', path)
exp.use('/uploads', express.static('uploads'))


exp.listen(port , () => console.log(`Server Running on port ${port}`))
