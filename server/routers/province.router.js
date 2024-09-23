const provinceController = require('../controllers/province.controller')
const provinceRouter = require('express').Router()

provinceRouter.post('/', provinceController.fetchProvinces)
provinceRouter.get('/', provinceController.getAllProvinces)

module.exports = provinceRouter
