const provinceController = require('../controllers/province.controller')
const customerController = require('../controllers/customer.controller')

const customerRouter = require('express').Router()

// GET
customerRouter.get('/user-signin', customerController.userLogin)
customerRouter.get('/keep-login', customerController.keepLogin)
customerRouter.get('/reset-password', customerController.resetPassword)
customerRouter.get('/forgot-password', customerController.findEmailForgotPassword)
customerRouter.get('/email-reverification', customerController.userReverification)
customerRouter.get('/total', customerController.getTotalCustomer)
customerRouter.get('/all', customerController.getAllCustomer)
customerRouter.get('/data-check', customerController.userDataCheck)

// POST
customerRouter.post('/register', customerController.userRegister)
customerRouter.post('/register-google', customerController.userRegisterWithGoogle)
customerRouter.post('/signin-google', customerController.userLoginWithGoogle)
customerRouter.post('/user-logout', customerController.userLogout)

// PATCH
customerRouter.patch('/verification', customerController.userVerification)
customerRouter.patch('/img-update', customerController.userImgUpdate)
customerRouter.patch('/data-update', customerController.userDataUpdate)
customerRouter.patch('/reset-password-verification', customerController.resetPasswordVerification)
customerRouter.patch('/email-update', customerController.userEmailUpdate)
customerRouter.patch('/email-update-verification', customerController.userEmailUpdateVerification)

module.exports = customerRouter
