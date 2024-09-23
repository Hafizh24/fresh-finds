const provinceController = require('../controllers/province.controller')
const shippingCostController = require('../controllers/shippingcost.controller')

const shippingCostRouter = require('express').Router()

shippingCostRouter.post('/calculate-cost', shippingCostController.calculateShippingCost)

module.exports = shippingCostRouter
