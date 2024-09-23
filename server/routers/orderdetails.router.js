const orderDetailsController = require('../controllers/orderdetails.controller')

const orderDetailsRouter = require('express').Router()

orderDetailsRouter.post('/', orderDetailsController.createOderDetail)
orderDetailsRouter.get('/', orderDetailsController.getAllOrderDetails)

module.exports = orderDetailsRouter
