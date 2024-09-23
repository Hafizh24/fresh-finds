// import jwt from 'jsonwebtoken'
require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = {
  verifyTokenAdmin: (req, res, next) => {
    try {
      let token = req.headers.authorization

      if (token == null) {
        return res.status(401).send({
          message: 'Token is missing'
        })
      }
      token = token.split(' ')[1]

      let verifiedAdmin = jwt.verify(token, process.env.KEY_JWT)

      console.log(verifiedAdmin, 'verifiedAdmin')

      req.admin = verifiedAdmin

      next()
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Your session has expired, please login again.',
          relogin: true
        })
      } else {
        return res.status(401).json({
          message: 'Unauthorized for admin'
        })
      }
    }
  },
  checkRoleAdmin: (req, res, next) => {
    try {
      if (req.admin.isSuperAdmin) {
        next()
      } else {
        return res.status(400).send({ message: 'You are not authorized' })
      }
    } catch (error) {
      return res.status(500).send({ message: error.message })
    }
  }
}
