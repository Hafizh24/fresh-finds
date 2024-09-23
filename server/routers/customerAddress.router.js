const customerAddressController = require('../controllers/customerAddress.controller')

const customerAddressRouter = require('express').Router()

customerAddressRouter.get('/', customerAddressController.getAll)
customerAddressRouter.get('/checkout', customerAddressController.getAllForCheckout)
customerAddressRouter.get('/list', customerAddressController.getAllByCustomerId)
customerAddressRouter.get('/delivery-address', customerAddressController.getDeliveryAddress)

//POST
customerAddressRouter.post('/create', customerAddressController.addressCreate)

//PATCH
customerAddressRouter.patch('/set-default/:id', customerAddressController.setDefaultAddress)
customerAddressRouter.patch('/set-delivery-address/:id', customerAddressController.setDeliveryAddress)
customerAddressRouter.patch('/edit/:id', customerAddressController.addressEdit)

//DELETE
customerAddressRouter.delete('/delete/:id', customerAddressController.deleteById)

module.exports = customerAddressRouter
