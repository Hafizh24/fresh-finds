const voucherController = require('../controllers/voucher.controller')

const voucherRouter = require('express').Router()

voucherRouter.post('/', voucherController.addVoucher)
voucherRouter.get('/customer', voucherController.getCustomerVoucher)
voucherRouter.get('/', voucherController.getAllVoucher)
voucherRouter.delete('/:id', voucherController.deleteVoucher)

module.exports = voucherRouter
