const { Voucher, CustomerVoucher } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

module.exports = {
  addVoucher: async (req, res) => {
    try {
      const { type, code, start_date, end_date, value, amount } = req.body

      const isCodeExist = await Voucher.findOne({
        where: {
          code: code
        }
      })

      if (isCodeExist) {
        return res.status(400).send({ message: 'Voucher code is already listed' })
      }

      await Voucher.create({
        type,
        code,
        value,
        amount,
        start_date,
        end_date
      })

      return res.status(200).send({ message: 'A new voucher has been created successfully' })
    } catch (error) {
      console.error(error)
      return res.status(400).send({ message: error.message })
    }
  },
  getCustomerVoucher: async (req, res) => {
    try {
      const { page } = req.query
      const limit = 6
      const offset = (page - 1) * limit

      const result = await CustomerVoucher.findAndCountAll({
        where: {
          CustomerId: req.user.id
        },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Voucher
            // attributes: ['type'],
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset)
      })

      const totalPages = Math.ceil(result.count / limit)
      res.status(200).send({ result: result, page, totalPages })
    } catch (error) {
      console.error(error)
      return res.status(400).send({ message: error.message })
    }
  },
  getAllVoucher: async (req, res) => {
    try {
      const { all, page, sortBy, sortOrder = 'asc', search = '' } = req.query
      const limit = 5
      const offset = (page - 1) * limit

      if (!all) {
        const allVouchers = await Voucher.findAndCountAll({
          where: {
            code: {
              [Op.like]: `%${search}%`
            }
          },
          order: [[sortBy, sortOrder.toUpperCase()]],
          limit: parseInt(limit),
          offset: parseInt(offset)
        })

        allVouchers.rows.forEach((row) => {
          row.dataValues.formattedStartDate = moment(row.start_date).format('MMMM Do YYYY, h:mm:ss a')
          row.dataValues.formattedEndDate = moment(row.end_date).format('MMMM Do YYYY, h:mm:ss a')
        })

        const totalPages = Math.ceil(allVouchers.count / limit)
        return res.status(200).send({ result: allVouchers, page, totalPages })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  deleteVoucher: async (req, res) => {
    try {
      const id = req.params.id
      const findVoucher = await Voucher.findOne({
        where: {
          id: id
        }
      })
      if (!findVoucher) {
        return res.status(404).send({ message: 'Voucher data not found' })
      }
      await Voucher.destroy({
        where: {
          id: id
        }
      })
      return res.status(200).send({ message: 'Voucher deleted' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  }
}
