const { Op, where } = require('sequelize')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const handlebars = require('handlebars')
const bcrypt = require('bcrypt')

const { Admin, Branch } = require('../models')
const transporter = require('../middleware/admin/admin.transporter')
const moment = require('moment')

function generateVerificationCode() {
  const length = 5
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let verificationCode = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    verificationCode += charset.charAt(randomIndex)
  }

  return verificationCode.toUpperCase()
}

module.exports = {
  createAdmin: async (req, res) => {
    try {
      const { name, username, email } = req.body

      const findUser = await Admin.findOne({
        where: {
          [Op.or]: [{ username }, { email }]
        }
      })

      if (findUser == null) {
        const vercode = generateVerificationCode()

        const result = await Admin.create({
          ...req.body,
          verification_code: vercode
        })

        let payload = { id: result.id }
        const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: '1h' })
        const data = fs.readFileSync('templates/admin/emailVerification.html', 'utf-8')
        const tempCompile = await handlebars.compile(data)
        const tempResult = tempCompile({
          name,
          username,
          email,
          link: `${process.env.BASE_URL}admin-verification/${token}`
        })

        await transporter.sendMail({
          from: 'hafizhcbs@gmail.com',
          to: email,
          subject: 'Fresh Finds - Account Verification',
          html: tempResult
        })

        return res.status(201).send({ message: 'A new admin has been created successfully' })
      } else {
        return res.status(400).send({ message: 'Account is already exists' })
      }
    } catch (error) {
      return res.status(500).send({ message: error.message })
    }
  },
  getAllAdmin: async (req, res) => {
    try {
      const { page, sortBy, sortOrder = 'asc', search = '' } = req.query

      const limit = 5
      const offset = (page - 1) * limit

      const dataAdmin = await Admin.findAndCountAll({
        include: [
          {
            model: Branch
          }
        ],
        where: {
          isSuperAdmin: false,
          name: {
            [Op.like]: `%${search}%`
          }
        },
        attributes: {
          exclude: ['password']
        },
        order: [sortBy === 'branch.name' ? [Branch, 'name', sortOrder.toUpperCase()] : [[sortBy, sortOrder.toUpperCase()]]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      })

      const totalPages = Math.ceil(dataAdmin.count / limit)
      return res.status(200).send({ result: dataAdmin, page, totalPages })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  deleteAdmin: async (req, res) => {
    const id = req.params.id
    try {
      const deletedCount = await Admin.destroy({
        where: {
          id: id
        }
      })

      if (deletedCount > 0) {
        return res.status(200).send({ message: 'Account successfully deleted' })
      } else {
        return res.status(404).send({ message: 'Account not found or already deleted' })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  loginAdmin: async (req, res) => {
    try {
      const { email, username, password } = req.body
      let dataLoginAdmin
      let isValid

      dataLoginAdmin = await Admin.findOne({
        where: email ? { email } : username ? { username } : null,
        include: [{ model: Branch }]
      })

      if (!dataLoginAdmin) {
        return res.status(404).send({ message: 'Account not found' })
      }

      if (!dataLoginAdmin.isVerified) {
        return res.status(403).send({ message: "Your account isn't verified" })
      }

      if (dataLoginAdmin.password) {
        isValid = await bcrypt.compare(password, dataLoginAdmin.password)
      }

      if (!isValid) {
        return res.status(400).send({ message: 'Invalid credentials' })
      }

      let payload = {
        id: dataLoginAdmin.id,
        isSuperAdmin: dataLoginAdmin.isSuperAdmin
      }
      const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: '1h' })

      dataLoginAdmin.dataValues.formattedCreatedAt = moment(dataLoginAdmin.createdAt).format('MMMM Do YYYY, h:mm:ss a')

      return res.status(200).send({
        message: 'Login success',
        result: dataLoginAdmin,
        token
      })
    } catch (error) {
      return res.status(500).send({ message: error.message })
    }
  },
  updateAdmin: async (req, res) => {
    const { id, name, username, email, password } = req.body

    try {
      const updateFields = {
        ...(name && { name }),
        ...(username && { username }),
        ...(email && { email })
      }
      if (password) {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        updateFields.password = hashPassword
      }
      if (req.file) {
        updateFields.profile_picture = `${process.env.BASE_URL_API}public/admin_pp/${req.file?.filename}`
      }
      const [updatedCount] = await Admin.update(updateFields, {
        where: { id: id }
      })

      if (updatedCount > 0) {
        return res.status(200).send({ message: 'Admin updated' })
      } else {
        return res.status(404).send({ message: 'Admin not found' })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  keepLoginAdmin: async (req, res) => {
    try {
      const adminData = await Admin.findOne({
        where: {
          id: req.admin.id
        },
        include: [{ model: Branch }]
      })

      if (!adminData) {
        return res.status(404).send({ message: 'Admin not found' })
      }

      adminData.dataValues.formattedCreatedAt = moment(adminData.createdAt).format('MMMM Do YYYY, h:mm:ss a')

      return res.status(200).send({ message: 'Keep login', result: adminData })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  updateVerifiedAdmin: async (req, res) => {
    try {
      const adminData = await Admin.findOne({
        where: {
          id: req.admin.id
        }
      })

      if (!adminData) {
        return res.status(404).json({ message: 'Account not found' })
      }

      if (adminData.isVerified) {
        return res.status(400).json({ message: 'Account is already verified' })
      }

      await Admin.update(
        { isVerified: true },
        {
          where: {
            id: req.admin.id
          }
        }
      )

      return res.status(200).send({ message: 'Account successfully verified' })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  },
  updatePasswordAdmin: async (req, res) => {
    try {
      const { password } = req.body
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)

      await Admin.update(
        {
          password: hashPassword
        },
        {
          where: {
            id: req.admin.id
          }
        }
      )
      return res.status(200).send({ message: 'Password successfully updated' })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  forgotPassword: async (req, res) => {
    try {
      let { email } = req.query

      const findAccount = await Admin.findOne({
        where: {
          email: email
        },
        attributes: {
          exclude: ['password']
        }
      })

      if (findAccount) {
        let payload = { id: findAccount.id }
        const path = require('path')
        const token = jwt.sign(payload, process.env.KEY_JWT, {
          expiresIn: '24h'
        })
        const data = fs.readFileSync('/templates/admin/forgotPassword.html', 'utf-8')
        const tempCompile = await handlebars.compile(data)
        const tempResult = tempCompile({
          email: email,
          link: `${process.env.BASE_URL}admin-reset-password/${token}`
        })

        await transporter.sendMail({
          from: 'freshfinds <FfX6H@example.com>',
          to: email,
          subject: 'Fresh Finds - Reset Password',
          html: tempResult
        })
        return res.status(200).send({ message: 'Email has been sent' })
      } else {
        return res.status(404).send({ message: 'Account not found' })
      }
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  getAllAdminNoPagination: async (req, res) => {
    try {
      const result = await Admin.findAll({
        include: [
          {
            model: Branch
          }
        ],
        where: {
          isSuperAdmin: false
        }
      })

      result.forEach((row) => {
        row.dataValues.formattedCreatedAt = moment(row.createdAt).format('MMMM Do YYYY, h:mm:ss a')
        row.dataValues.formattedUpdatedAt = moment(row.updatedAt).format('MMMM Do YYYY, h:mm:ss a')
      })

      return res.status(200).send(result)
    } catch (error) {
      console.error(error)
      res.status(400).send({ message: error.message })
    }
  },
  getVerCode: async (req, res) => {
    try {
      const account = await Admin.findOne({
        where: {
          id: req.admin.id
        },
        attributes: ['verification_code', 'password']
      })

      if (!account) {
        return res.status(404).send({ message: 'Account not found' })
      }

      return res.status(200).send(account)
    } catch (error) {
      return res.status(500).send({ message: error.message })
    }
  },
  getTotalAdmin: async (req, res) => {
    try {
      const totalAdmin = await Admin.count({
        where: {
          isSuperAdmin: false
        }
      })
      const latestAdded = await Admin.findOne({
        where: {
          isSuperAdmin: false
        },
        order: [['createdAt', 'DESC']]
      })
      res.status(200).send({ totalAdmin, latestAdded })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  logoutAdmin: async (req, res) => {
    try {
      req.admin = null
      return res.status(200).send({
        message: 'Logout success'
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  superAdmin: async (req, res) => {
    try {
      const { name, username, email, password, code } = req.body

      if (!code) {
        return res.status(400).send({ message: 'Please input code' })
      }

      if (code != 'freshfinds') {
        return res.status(400).send({ message: 'Wrong code' })
      }

      const findAdmin = await Admin.findOne({
        where: {
          [Op.or]: [{ username }, { email }]
        }
      })

      if (findAdmin) {
        return res.status(400).send({ message: 'Account is already exist' })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      const verCode = 'SA'

      await Admin.create({
        name,
        username,
        email,
        password: hashedPassword,
        isVerified: true,
        isSuperAdmin: true,
        verification_code: verCode
      })

      return res.status(201).send({ message: 'Super admin has been created successfully' })
    } catch (error) {
      return res.status(500).send({ message: error.message })
    }
  }
}
