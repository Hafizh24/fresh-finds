const router = require('express').Router()
const adminRouter = require('./routers/admin.router')
const categoryRouter = require('./routers/category.router')
const cityRouter = require('./routers/city.router')
const provinceRouter = require('./routers/province.router')
const productRouter = require('./routers/product.router')
const customerRouter = require('./routers/customer.router')
const branchRouter = require('./routers/branch.router')

router.use('/admins', adminRouter)
router.use('/branches', branchRouter)
router.use('/categories', categoryRouter)
router.use('/cities', cityRouter)
router.use('/customer', customerRouter)
router.use('/provinces', provinceRouter)
router.use('/products', productRouter)

router.get('/', (req, res) => {
  res.send('Hello World')
})

module.exports = router
