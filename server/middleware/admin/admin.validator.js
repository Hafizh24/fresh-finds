const { body, query, validationResult } = require('express-validator')

module.exports = {
  checkRegisterAdmin: async (req, res, next) => {
    try {
      await body('name').notEmpty().withMessage('Name required').run(req)
      await body('username').notEmpty().withMessage('Username required').run(req)
      await body('email').notEmpty().withMessage('Email required').isEmail().withMessage('invalid email').run(req)

      const validation = validationResult(req)

      if (validation.isEmpty()) {
        next()
      } else {
        return res.status(400).send({
          message: 'validation invalid',
          error: validation.array()
        })
      }
    } catch (err) {
      console.log(err)
      res.status(400).send(err)
    }
  },
  checkLoginAdmin: async (req, res, next) => {
    try {
      const { username, email } = req.body

      if (!username && !email) {
        return res.status(400).send({
          message: 'Username or email is required'
        })
      }

      if (username) {
        await body('username').notEmpty().withMessage('Username required').run(req)
      }

      if (email) {
        await body('email').notEmpty().withMessage('Email required').isEmail().withMessage('Invalid email').run(req)
      }

      await body('password').notEmpty().withMessage('Password required').isLength({ min: 3 }).withMessage('Password must be at least 3 characters').run(req)

      const validation = validationResult(req)

      if (validation.isEmpty()) {
        next()
      } else {
        return res.status(400).send({
          message: 'validation invalid',
          error: validation.array()
        })
      }
    } catch (err) {
      console.log(err)
      res.status(400).send(err)
    }
  }
}
