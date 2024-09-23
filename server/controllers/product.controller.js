require('dotenv').config()
const { Product, ProductImage, ProductBranch, StockHistory, Admin, Branch, Discount, Category, SubCategory } = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const moment = require('moment')

module.exports = {
  addProduct: async (req, res) => {
    try {
      const { name, description, price, weight, category_id, subcategory_id, stock, branch_id } = req.body

      const findProduct = await Product.findOne({
        where: {
          name: name,
          isDeleted: false
        }
      })

      if (findProduct) {
        return res.status(400).send({ message: 'Product already exist' })
      }

      const result = await Product.create({
        name: name,
        description: description,
        price: price,
        weight: weight,
        CategoryId: category_id
      })

      await ProductImage.create({
        image: `${process.env.BASE_URL_API}public/products/${req.file?.filename}`,
        ProductId: result.id
      })

      if (stock && branch_id) {
        const product_branch_result = await ProductBranch.create({
          stock: stock ? stock : 0,
          BranchId: branch_id,
          ProductId: result.id
        })

        await StockHistory.create({
          initialStock: stock,
          finalStock: stock,
          difference: 0,
          ProductBranchId: product_branch_result.id,
          updatedBy: 'Super Admin'
        })
      }

      if (subcategory_id) {
        await Product.update(
          {
            SubCategoryId: subcategory_id
          },
          {
            where: {
              name: name
            }
          }
        )
      }
      return res.status(201).send({ message: 'A new product has been created successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getAllProducts: async (req, res) => {
    try {
      let { page, sortBy, sortOrder = 'asc', search = '', category, all } = req.query

      const limit = 8
      const offset = (page - 1) * limit

      let whereCondition = {
        isDeleted: {
          [Op.not]: true
        }
      }

      if (all) {
        const allProducts = await Product.findAll({
          include: [
            {
              model: Category
            },
            {
              model: SubCategory
            }
          ],
          where: {
            isDeleted: false
          }
        })
        return res.status(200).send({ result: allProducts })
      }

      if (category != 0) {
        whereCondition = {
          ...whereCondition,
          '$Category.id$': category
        }
      }

      if (sortBy === 'active') {
        whereCondition = {
          ...whereCondition,
          isDisabled: false
        }
        sortBy = 'createdAt'
      } else if (sortBy === 'disabled') {
        whereCondition = {
          ...whereCondition,
          isDisabled: true
        }
        sortBy = 'createdAt'
      }

      if (search) {
        whereCondition = {
          ...whereCondition,
          name: {
            [Op.like]: `%${search}%`
          }
        }
      }

      const allProducts = await Product.findAndCountAll({
        include: [
          {
            model: Category,
            attributes: ['name']
          },
          {
            model: SubCategory,
            attributes: ['name']
          }
        ],
        where: whereCondition,
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      })
      const totalPages = Math.ceil(allProducts.count / limit)
      return res.status(200).send({ result: allProducts, page, totalPages })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  editProduct: async (req, res) => {
    try {
      const { id, name, description, price, weight, stock, category_id, subcategory_id, isDisabled, branch_id, updatedBy } = req.body

      const updateFields = {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(weight && { weight })
      }

      if (category_id) {
        updateFields.CategoryId = category_id
      }
      if (subcategory_id) {
        updateFields.SubCategoryId = subcategory_id
      }

      updateFields.isDisabled = isDisabled

      const findProduct = await Product.findOne({
        where: {
          id: id
        }
      })

      if (!findProduct) {
        return res.status(404).send({ message: 'Product not found' })
      }

      if (category_id) {
        if (findProduct.CategoryId != updateFields.category_id) {
          await Product.update({ SubCategoryId: null }, { where: { id: findProduct.id } })
        }
      }

      if (req.file?.filename) {
        const product_images = await ProductImage.findAll({
          where: {
            ProductId: id
          }
        })

        if (product_images.length >= 3) {
          return res.status(400).send({ message: "Can't have more than 3 images" })
        }

        await ProductImage.create({
          image: `${process.env.BASE_URL_API}public/products/${req.file?.filename}`,
          ProductId: id
        })
      }

      const findBranchProduct = await ProductBranch.findAll({
        where: {
          BranchId: branch_id,
          ProductId: id
        }
      })

      if (findBranchProduct.length > 0) {
        return res.status(404).send({ message: 'This product is already assigned to this branch' })
      }

      if (branch_id && stock) {
        const productBranchResult = await ProductBranch.create({
          stock: stock,
          BranchId: branch_id,
          ProductId: id
        })

        await StockHistory.create({
          initialStock: stock,
          finalStock: stock,
          difference: 0,
          ProductBranchId: productBranchResult.id,
          updatedBy: updatedBy
        })
      }

      await Product.update(updateFields, {
        where: {
          id: id
        }
      })
      return res.status(200).send({ message: 'Product updated' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id
      const findProduct = await Product.findOne({
        where: {
          id: id
        }
      })
      if (!findProduct) {
        return res.status(404).send({ message: 'Product not found' })
      }
      await Product.update(
        {
          isDeleted: true,
          isDisabled: true
        },
        {
          where: {
            id: id
          }
        }
      )
      await ProductBranch.destroy({
        where: {
          ProductId: id
        }
      })
      return res.status(200).send({ message: 'Product deleted' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getTotalProduct: async (req, res) => {
    try {
      const totalProduct = await Product.count({
        where: {
          isDeleted: false
        }
      })
      res.status(200).send({ totalProduct })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getProductImages: async (req, res) => {
    try {
      const id = req.params.id
      const imageProduct = await ProductImage.findOne({
        where: {
          ProductId: id
        }
      })
      res.status(200).send({ imageProduct })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getProductImages2: async (req, res) => {
    try {
      const id = req.params.id
      const imageProduct = await ProductImage.findAll({
        where: {
          ProductId: id
        }
      })
      res.status(200).send({ imageProduct })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  deleteProductImage: async (req, res) => {
    try {
      const { id, product_id } = req.query
      const imageProduct = await ProductImage.findAll({
        where: {
          ProductId: product_id
        }
      })

      if (imageProduct.length === 1) {
        return res.status(400).send({ message: 'One image is required' })
      }
      await ProductImage.destroy({
        where: {
          id: id
        }
      })

      return res.status(200).send({ message: 'Image has been deleted' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getAllBranchProduct: async (req, res) => {
    try {
      const { cond, page, sortBy, sortOrder = 'asc', search = '', admid, branch_id } = req.query

      const limit = 6
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
          BranchId: branchIds
        }
      }

      if (branch_id) {
        whereCondition = {
          BranchId: branch_id
        }
      }

      if (search) {
        whereCondition = {
          ...whereCondition,
          [Op.and]: {
            '$Product.name$': {
              [Op.like]: `%${search}%`
            }
          }
        }
      }

      if (cond && cond === 'disc') {
        const allBranchProducts = await ProductBranch.findAndCountAll({
          include: [
            {
              model: Product
            },
            {
              model: Branch
            },
            {
              model: Discount
            }
          ],
          where: {
            [Op.and]: [whereCondition, { '$Discounts.id$': null }]
          }
        })
        return res.status(200).send({ result: allBranchProducts })
      }

      const allBranchProducts = await ProductBranch.findAndCountAll({
        include: [
          {
            model: Product
          },
          {
            model: Branch
          }
        ],
        where: whereCondition,
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      })
      const totalPages = Math.ceil(allBranchProducts.count / limit)
      return res.status(200).send({ result: allBranchProducts, page, totalPages })

      // return res.status(200).send({ message: 'success' });
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getAllBranchProductCustomer: async (req, res) => {
    try {
      const { limit, page, sortBy, sortOrder = 'asc', search = '', branch_id, category_id, subcategory_id, discounted } = req.query

      const offset = (page - 1) * limit

      let whereCondition = {
        BranchId: branch_id,
        '$Product.isDeleted$': false,
        '$Product.isDisabled$': false
      }

      if (category_id && category_id != 0) {
        whereCondition = {
          ...whereCondition,
          '$Product.CategoryId$': category_id
        }
      } else if (subcategory_id && subcategory_id != 0) {
        whereCondition = {
          ...whereCondition,
          '$Product.SubCategoryId$': subcategory_id
        }
      }

      if (search || search != undefined) {
        whereCondition = {
          ...whereCondition,
          [Op.and]: {
            '$Product.name$': {
              [Op.like]: `%${search}%`
            }
          }
        }
      }

      let include_model_discount = {}

      if (discounted) {
        include_model_discount = {
          model: Discount,
          required: true
        }
      } else {
        include_model_discount = {
          model: Discount
        }
      }

      const allBranchProducts = await ProductBranch.findAndCountAll({
        include: [
          {
            model: Product,
            required: true,
            where: {
              isDeleted: false,
              isDisabled: false
            },
            include: [
              {
                model: Category
              },
              {
                model: SubCategory
              }
            ]
          },
          include_model_discount,
          {
            model: Branch,
            required: true
          }
        ],
        where: whereCondition,
        order: [
          sortBy === 'name' && !discounted
            ? [sequelize.literal('`Product.name`'), sortOrder.toUpperCase()]
            : sortBy === 'price' && !discounted
            ? [sequelize.literal('`Product.price`'), sortOrder.toUpperCase()]
            : discounted && discounted === 'true'
            ? [Discount, 'difference', 'DESC']
            : [[sortBy, sortOrder.toUpperCase()]]
        ],
        limit: limit ? parseInt(limit) : null,
        offset: parseInt(offset)
      })
      const totalPages = Math.ceil(allBranchProducts.count / limit)

      allBranchProducts.rows.forEach((productBranch) => {
        let discounted_price = 0
        let percentage = ''
        if (productBranch.Discounts.length > 0) {
          if (productBranch.Discounts[0].value === 'percentage') {
            discounted_price = productBranch.Product.price - productBranch.Product.price * productBranch.Discounts[0].amount
            percentage = (productBranch.Discounts[0].amount * 100).toString() + '%'
          } else {
            discounted_price = productBranch.Product.price - productBranch.Discounts[0].amount
            percentage = ((productBranch.Discounts[0].amount / productBranch.Product.price) * 100).toString() + '%'
          }
          productBranch.dataValues.hasDiscount = true
        }

        productBranch.dataValues.discounted_price = discounted_price
        productBranch.dataValues.original_price = productBranch.Product.price
        productBranch.dataValues.percentage = percentage
      })

      return res.status(200).send({ result: allBranchProducts, page, totalPages })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getProductBranchById: async (req, res) => {
    try {
      const id = req.params.id
      const branch_id = req.params.branch_id

      const findBranchProduct = await ProductBranch.findOne({
        where: {
          ProductId: id,
          BranchId: branch_id
        },
        include: [
          {
            model: Product,
            include: [
              {
                model: Category,
                attributes: ['name']
              },
              {
                model: SubCategory,
                attributes: ['name']
              }
            ]
          },
          {
            model: Discount
          }
        ]
      })

      if (!findBranchProduct) {
        return res.status(404).send({ message: 'Product not found' })
      }

      let discounted_price = 0
      let percentage
      if (findBranchProduct.Discounts.length > 0) {
        if (findBranchProduct.Discounts[0].type === 'regular' || findBranchProduct.Discounts[0].type === 'minimum_purchase') {
          if (findBranchProduct.Discounts[0].value === 'percentage') {
            discounted_price = findBranchProduct.Product.price - findBranchProduct.Product.price * findBranchProduct.Discounts[0].amount
            percentage = (findBranchProduct.Discounts[0].amount * 100).toString() + '%'
          } else {
            discounted_price = findBranchProduct.Product.price - findBranchProduct.Discounts[0].amount
            percentage = Math.round((findBranchProduct.Discounts[0].amount / findBranchProduct.Product.price) * 100).toString() + '%'
          }
          findBranchProduct.dataValues.percentage = percentage
          findBranchProduct.dataValues.discounted_price = discounted_price
          findBranchProduct.dataValues.original_price = findBranchProduct.Product.price
        } else if (findBranchProduct.Discount[0].type === 'buy1get1') {
          findBranchProduct.dataValues.discounted_price = discounted_price
          findBranchProduct.dataValues.original_price = findBranchProduct.Product.price
        }
        findBranchProduct.dataValues.hasDiscount = true
      } else {
        findBranchProduct.dataValues.discounted_price = discounted_price
        findBranchProduct.dataValues.original_price = findBranchProduct.Product.price
      }

      return res.status(200).send({ result: findBranchProduct })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  updateStockBranchProduct: async (req, res) => {
    try {
      const { id, stock_input, updater, operation } = req.body

      const findBranchProduct = await ProductBranch.findOne({
        where: {
          id: id
        }
      })

      if (!findBranchProduct) {
        return res.status(404).send({ message: 'Product not found' })
      }

      let final_stock = 0
      if (operation === 'add') {
        final_stock = findBranchProduct.stock + stock_input
      } else if (operation === 'subtract') {
        final_stock = findBranchProduct.stock - stock_input
      }

      const findStockHistory = await StockHistory.findOne({
        where: {
          ProductBranchId: findBranchProduct.id
        },
        order: [['id', 'desc']],
        limit: 1
      })

      if (!findStockHistory) {
        return res.status(404).send({
          message: "This product doesn't have stock history, please re-input this product"
        })
      }

      let difference = 0
      let status = ''
      if (final_stock > findStockHistory.finalStock) {
        difference = final_stock - findStockHistory.finalStock
        status = 'increased'
      } else if (final_stock < findStockHistory.finalStock) {
        difference = findStockHistory.finalStock - final_stock
        status = 'decreased'
      }

      await StockHistory.create({
        initialStock: findStockHistory.finalStock,
        finalStock: final_stock,
        difference: difference,
        status: status,
        ProductBranchId: id,
        updatedBy: updater
      })

      await ProductBranch.update(
        {
          stock: final_stock
        },
        {
          where: {
            id: id
          }
        }
      )

      res.status(200).send({ message: 'Stock updated' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getProductStockHistory: async (req, res) => {
    try {
      const { id, month, page, sortBy, sortOrder = 'asc', search = '' } = req.query
      const limit = 6
      const offset = (page - 1) * limit

      const formattedMonth = moment(month, 'MM').format('YYYY-MM') // Convert month to 'YYYY-MM' format
      const startDate = moment(`${formattedMonth}-01`).startOf('month').toDate() // Start of the month
      const endDate = moment(startDate).endOf('month').toDate() // End of the month

      const findStockHistory = await StockHistory.findAndCountAll({
        where: {
          ProductBranchId: id,
          createdAt: {
            [Op.and]: [{ [Op.gte]: startDate }, { [Op.lt]: endDate }]
          }
        },
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      })

      const stockSummary = await StockHistory.findAndCountAll({
        where: {
          ProductBranchId: id,
          createdAt: {
            [Op.and]: [{ [Op.gte]: startDate }, { [Op.lt]: endDate }]
          }
        }
      })

      if (!findStockHistory || findStockHistory.count === 0) {
        return res.status(404).send({ message: 'No stock history found for the specified month' })
      }

      const totalPages = Math.ceil(findStockHistory.count / limit)

      const totalDataChanges = stockSummary.count
      let total_increment = 0
      let total_decrement = 0
      let final_stock = 0

      findStockHistory.rows.forEach((row) => {
        row.dataValues.formattedCreatedAt = moment(row.createdAt).format('MMMM Do YYYY, h:mm:ss a')
      })

      stockSummary.rows.forEach((row) => {
        if (row.status === 'increased') {
          total_increment += row.difference
        } else if (row.status === 'decreased') {
          total_decrement += row.difference
        }
        final_stock = row.finalStock
      })

      res.status(200).send({
        result: findStockHistory,
        totalDataChanges,
        total_increment,
        total_decrement,
        final_stock,
        page,
        totalPages
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  deleteBranchProduct: async (req, res) => {
    try {
      const id = req.params.id
      const findBranchProduct = await ProductBranch.findOne({
        where: {
          id: id
        }
      })
      if (!findBranchProduct) {
        return res.status(404).send({ message: 'Product not found' })
      }
      await ProductBranch.destroy({
        where: {
          id: id
        }
      })

      return res.status(200).send({ message: 'Product has been deleted' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  }
}
