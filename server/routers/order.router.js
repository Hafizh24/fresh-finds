const orderController = require('../controllers/order.controller')

const orderRouter = require('express').Router()

orderRouter.post('/', orderController.addOrder)
orderRouter.patch('/', orderController.createPayment)

module.exports = orderRouter
