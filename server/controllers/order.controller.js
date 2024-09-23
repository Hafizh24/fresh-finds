const { Order, OrderDetail } = require('../models')
const Midtrans = require('midtrans-client')

module.exports = {
  addOrder: async (req, res) => {
    const { id, products } = req.body

    try {
      const order = await Order.create({
        id: id,
        status: 'waiting_for_payment',
        isPaid: 0,
        CustomerId: req.user.id
      })

      const product = products.map((item) => ({
        quantity: item.quantity,
        total: item.price * item.quantity,
        ProductId: item.id,
        OrderId: id
      }))

      const result = await OrderDetail.bulkCreate(product)

      return res.status(201).send({ message: 'A new order has been created successfully', result })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error.message })
    }
  },
  createPayment: async (req, res) => {
    let snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    })

    try {
      const { id, total } = req.body

      const params = {
        transaction_details: {
          order_id: id,
          gross_amount: total
        }
      }

      const token = await snap.createTransactionToken(params)
      console.log(token, '>>>>> token')

      const findOrder = await Order.findOne({
        where: {
          id: id
        }
      })

      if (!findOrder) {
        return res.status(404).send({ message: 'order not found' })
      }
      await Order.update(
        {
          status: 'completed',
          payment_method: 'automatic',
          isPaid: true
        },
        {
          where: {
            id: id
          }
        }
      )

      return res.status(200).send({ token })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  }
}
