const branchController = require('../controllers/branch.controller')
const { checkRoleAdmin, verifyTokenAdmin } = require('../middleware/admin/admin.auth')

const brancRouter = require('express').Router()

brancRouter.get('/', verifyTokenAdmin, branchController.getAll)
brancRouter.get('/total', verifyTokenAdmin, branchController.getTotalBranch)
brancRouter.get('/super-store', branchController.getSuperStore)
brancRouter.get('/assigned', verifyTokenAdmin, branchController.getAllbyAdminId)
brancRouter.get('/all', verifyTokenAdmin, branchController.getAllBranch)

brancRouter.get('/:id', verifyTokenAdmin, checkRoleAdmin, branchController.getById)

//POST
brancRouter.post('/get-nearest', branchController.getNearestBranch)
brancRouter.post('/', verifyTokenAdmin, checkRoleAdmin, branchController.addBranch)

//PATCH
brancRouter.patch('/:id', verifyTokenAdmin, checkRoleAdmin, branchController.editBranch)
brancRouter.patch('/change-status/:id', verifyTokenAdmin, checkRoleAdmin, branchController.changeStatus)
brancRouter.patch('/delete/:id', verifyTokenAdmin, checkRoleAdmin, branchController.deleteById)

module.exports = brancRouter
