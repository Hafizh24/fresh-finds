const { OrderDetail } = require('../models')

module.exports = {
  createOderDetail: async (req, res) => {
    try {
      const data = req.body

      const product = data.map((item) => ({
        quantity: item.quantity,
        total: item.price * item.quantity,
        ProductId: item.id
      }))

      const result = await OrderDetail.bulkCreate(product)

      return res.status(201).send({
        message: 'order details has been created successfully'
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getAllOrderDetails: async (req, res) => {
    const result = await OrderDetail.findAll()

    return res.status(200).send({ result })
  }
}
