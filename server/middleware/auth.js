const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  verifyToken: (req, res, next) => {
    try {
      let token = req.headers.authorization
      console.log(token)
      if (token == null) {
        return res.status(401).send({
          message: 'Token is empty'
        })
      }

      token = token.split(` `)[1]

      let verifiedUser = jwt.verify(token, process.env.KEY_JWT)
      req.user = verifiedUser // creating new object property in req
      next()
    } catch (error) {
      console.log('jwt error', error)
      res.status(400).send(error)
    }
  }
}
