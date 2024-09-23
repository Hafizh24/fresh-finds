const categoryController = require('../controllers/category.controller')
const { checkRoleAdmin, verifyTokenAdmin } = require('../middleware/admin/admin.auth')

const categoryRouter = require('express').Router()

// category
categoryRouter.post('/', verifyTokenAdmin, categoryController.addCategory)
categoryRouter.get('/', verifyTokenAdmin, categoryController.getAllCategories)
categoryRouter.get('/all', categoryController.getAllCategories)
categoryRouter.delete('/:id', verifyTokenAdmin, categoryController.deleteCategory)
categoryRouter.patch('/', verifyTokenAdmin, categoryController.updateCategory)

// sub category
categoryRouter.get('/sub-category', verifyTokenAdmin, categoryController.getAllSubCategory)
categoryRouter.get('/sub-category/:id', verifyTokenAdmin, categoryController.getAllSubCategoryById)
categoryRouter.patch('/sub-category/remove', verifyTokenAdmin, categoryController.removeSubCategoryOfCategory)
categoryRouter.patch('/sub-category/', verifyTokenAdmin, categoryController.updateSubCategory)
categoryRouter.delete('/sub-category/:id', verifyTokenAdmin, categoryController.deleteSubCategory)

module.exports = categoryRouter
