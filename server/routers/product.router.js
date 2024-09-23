const productController = require('../controllers/product.controller')
const discountController = require('../controllers/discount.controller')

const productRouter = require('express').Router()

productRouter.get('/', productController.getAllProducts)
productRouter.post('/', productController.addProduct)
productRouter.patch('/', productController.editProduct)
productRouter.patch('/:id', productController.deleteProduct)
productRouter.get('/total', productController.getTotalProduct)
productRouter.get('/all', productController.getAllBranchProductCustomer)

// product image
// productRouter.get('/images/:id', productController.getProductImage)
productRouter.get('/images-all/:id', productController.getProductImages2)
productRouter.delete('/images', productController.deleteProductImage)

// product branch
productRouter.get('/branch-product', productController.getAllBranchProduct)
productRouter.patch('/branch-product/stock', productController.updateStockBranchProduct)
productRouter.delete('/branch-product/:id', productController.deleteBranchProduct)
productRouter.get('/branch-product/:id/:branch_id', productController.getProductBranchById)

// branch product discount
productRouter.post('/discount', discountController.addDiscount)
productRouter.patch('/discount/edit', discountController.updateDiscount)
productRouter.get('/discount', discountController.getAllDiscount)
productRouter.get('/discount/total', discountController.getTotalDiscount)
productRouter.delete('/discount/:id', discountController.deleteDiscount)

// history
productRouter.get('/history', productController.getProductStockHistory)

module.exports = productRouter
