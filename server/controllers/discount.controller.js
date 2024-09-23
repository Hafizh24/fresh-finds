const { Admin, Branch, Discount, ProductBranch, Product } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

module.exports = {
  getAllDiscount: async (req, res) => {
    try {
      const { page, sortBy, sortOrder = 'asc', search, admid } = req.query
      const limit = 5
      const offset = (page - 1) * limit

      const findAdmin = await Admin.findOne({
        where: {
          id: admid
        }
      })

      let whereCondition = {}
      if (admid && findAdmin.isSuperAdmin === false) {
        const findBranches = await Branch.findAll({
          where: {
            AdminId: admid
          }
        })

        const branchIds = findBranches.map((branch) => branch.id)
        whereCondition = {
          '$ProductBranch.Branch.id$': branchIds
        }
      }
      if (search) {
        whereCondition = {
          ...whereCondition,
          [Op.and]: {
            '$ProductBranch.Product.name$': {
              [Op.like]: `%${search}%`
            }
          }
        }
      }

      const allDiscount = await Discount.findAndCountAll({
        include: [
          {
            model: ProductBranch,
            include: [{ model: Product }, { model: Branch }]
          }
        ],
        where: whereCondition,
        order: [sortBy === 'product.name' ? [ProductBranch, Product, 'name', sortOrder.toUpperCase()] : [[sortBy, sortOrder.toUpperCase()]]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      })

      allDiscount.rows.forEach((row) => {
        row.dataValues.formattedCreatedAt = moment(row.createdAt).format('MMMM Do YYYY, h:mm:ss a')
        row.dataValues.formattedUpdatedAt = moment(row.updatedAt).format('MMMM Do YYYY, h:mm:ss a')
      })

      const totalPages = Math.ceil(allDiscount.count / limit)
      return res.status(200).send({ result: allDiscount, page, totalPages })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getTotalDiscount: async (req, res) => {
    try {
      const { admid } = req.query
      console.log(req.query)

      const findAdmin = await Admin.findOne({
        where: {
          id: admid
        }
      })

      let whereCondition = {}
      if (admid && findAdmin.isSuperAdmin === false) {
        const findBranches = await Branch.findAll({
          where: {
            AdminId: admid
          }
        })

        const branchIds = findBranches.map((branch) => branch.id)
        whereCondition = {
          '$ProductBranch.Branch.id$': branchIds
        }
      }

      const totalDiscount = await Discount.count({
        include: [
          {
            model: ProductBranch,
            include: [{ model: Product }, { model: Branch }]
          }
        ],
        where: whereCondition
      })
      res.status(200).send({ totalDiscount })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  addDiscount: async (req, res) => {
    try {
      const { type, value, min_purchase_amount, max_discount, productbranchid, amount } = req.body

      const findDiscount = await Discount.findOne({
        where: {
          ProductBranchId: productbranchid
        }
      })

      if (findDiscount) {
        return res.status(400).send({ message: 'Discount for this product already exist' })
      }

      const findProduct = await ProductBranch.findOne({
        where: {
          id: productbranchid
        },
        include: [
          {
            model: Product,
            attributes: ['price']
          }
        ]
      })

      let discount_amount = 0
      let difference = 0

      if (value === 'percentage') {
        discount_amount = amount / 100
        if (amount < 0 || amount > 100) {
          return res.status(400).send({ message: 'The percentage discount must be between 0 and 100.' })
        }
        difference = findProduct.Product.price - (findProduct.Product.price - findProduct.Product.price * discount_amount)
      } else {
        discount_amount = amount
        if (discount_amount > findProduct.Product.price) {
          return res.status(400).send({ message: 'The discount amount cannot exceed the original price.' })
        }
        difference = findProduct.Product.price - (findProduct.Product.price - discount_amount)
      }

      await Discount.create({
        type: type,
        value: value,
        min_purchase_amount: min_purchase_amount,
        max_discount: max_discount,
        amount: discount_amount,
        difference: difference,
        ProductBranchId: productbranchid
      })

      return res.status(201).send({ message: 'A new discount has been created successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  updateDiscount: async (req, res) => {
    try {
      const { id, value, min_purchase_amount, max_discount, amount } = req.body

      const updateFields = {
        ...(value && { value }),
        ...(min_purchase_amount && { min_purchase_amount }),
        ...(max_discount && { max_discount }),
        ...(amount && { amount })
      }

      const findDiscount = await Discount.findOne({
        where: {
          id: id
        }
      })

      if (!findDiscount) {
        return res.status(404).send({ message: 'Discount data not found' })
      }

      await Discount.update(updateFields, {
        where: {
          id: id
        }
      })

      return res.status(200).send({ message: 'Discount data updated' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  deleteDiscount: async (req, res) => {
    try {
      const id = req.params.id
      const findDiscount = await Discount.findOne({
        where: {
          id: id
        }
      })
      if (!findDiscount) {
        return res.status(404).send({ message: 'Discount data not found' })
      }
      await Discount.destroy({
        where: {
          id: id
        }
      })
      return res.status(200).send({ message: 'Discount deleted' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  }
}
