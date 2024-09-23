const cityController = require('../controllers/city.controller')

const cityRouter = require('express').Router()

cityRouter.post('/', cityController.fetchCities)
cityRouter.get('/', cityController.getAllCities)

module.exports = cityRouter
