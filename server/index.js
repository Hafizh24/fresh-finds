require('dotenv').config()
const express = require('express')
const db = require('./models')
const cors = require('cors')
const router = require('./router')
const PORT = process.env.PORT || 2000
const app = express()

app.use(cors())
app.use(express.json())
app.use('/public', express.static('./public'))

app.use('/api', router)

app.listen(PORT, () => {
  // db.sequelize.sync({ alter: true })
  console.clear()
  console.log(`Server running on Port : http://localhost:${PORT}`)
})
