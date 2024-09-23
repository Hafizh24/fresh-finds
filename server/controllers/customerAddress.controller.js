const { CustomerAddress, Customer, City, Province } = require('../models')

module.exports = {
  getAll: async (req, res) => {
    try {
      const result = await CustomerAddress.findAll({
        include: [
          {
            model: Customer,
            attributes: ['email']
          }
        ]
      })
      res.status(200).send({ result: result })
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  addressCreate: async (req, res) => {
    try {
      const { title, customerAddressName, phoneNumber, address, longitude, latitude, fullAddress, province_id, CityId } = req.body

      const findAddress = await CustomerAddress.findOne({
        where: {
          address,
          CustomerId: req.user.id
        }
      })

      if (findAddress == null) {
        const result = await CustomerAddress.create(
          {
            ...req.body,
            CustomerId: req.user.id
          },
          {
            include: [
              {
                model: Customer,
                attributes: ['email']
              }
            ]
          }
        )

        return res.status(200).send({ message: 'Success Adding new address!', result: result })
      } else {
        console.log('Address is already on your address list')
        return res.status(400).send({ message: 'Address is already on your list' })
      }
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  addressEdit: async (req, res) => {
    try {
      const { title, customerAddressName, phoneNumber, address, longitude, latitude, fullAddress, province_id, CityId } = req.body

      await CustomerAddress.update(
        {
          ...req.body
        },
        {
          where: {
            CustomerId: req.user.id,
            id: req.params.id
          }
        }
      )
      res.status(200).send({ message: 'Success updating address' })
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.messsage })
    }
  },
  getAllByCustomerId: async (req, res) => {
    try {
      const { page } = req.query
      const limit = 4
      const offset = (page - 1) * limit

      const result = await CustomerAddress.findAndCountAll({
        where: {
          CustomerId: req.user.id
        },
        order: [
          ['isDefault', 'DESC'],
          ['createdAt', 'DESC']
        ],
        include: [
          {
            model: City,
            attributes: ['city'],
            include: [
              {
                model: Province,
                attributes: ['province']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset)
      })

      const totalPages = Math.ceil(result.count / limit)
      res.status(200).send({ result: result, page, totalPages })
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  getAllForCheckout: async (req, res) => {
    try {
      const { page } = req.query
      const limit = 4
      const offset = (page - 1) * limit

      const result = await CustomerAddress.findAndCountAll({
        where: {
          CustomerId: req.user.id
        },
        order: [
          ['isDeliveryAddress', 'DESC'],
          ['isDefault', 'DESC'],
          ['createdAt', 'DESC']
        ],
        include: [
          {
            model: City,
            attributes: ['city'],
            include: [
              {
                model: Province,
                attributes: ['province']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset)
      })

      const totalPages = Math.ceil(result.count / limit)
      res.status(200).send({ result: result, page, totalPages })
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  deleteById: async (req, res) => {
    try {
      await CustomerAddress.destroy({
        where: {
          CustomerId: req.user.id,
          id: req.params.id
        }
      })
      res.status(200).send({ message: 'Success deleting address' })
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  setDefaultAddress: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user.id

      const currentDefaultAddress = await CustomerAddress.findOne({
        where: {
          CustomerId: userId,
          isDefault: true
        }
      })

      if (currentDefaultAddress) {
        await currentDefaultAddress.update({ isDefault: false })
      }

      const newDefaultAddress = await CustomerAddress.update(
        {
          isDefault: true
        },
        {
          where: {
            CustomerId: userId,
            id: id
          }
        }
      )
      res.status(200).send({ message: 'Default Address updated' })
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  setDeliveryAddress: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user.id

      const currentDeliveryAddress = await CustomerAddress.findOne({
        where: {
          CustomerId: userId,
          isDeliveryAddress: true
        }
      })

      if (currentDeliveryAddress) {
        await currentDeliveryAddress.update({ isDeliveryAddress: false })
      }

      const newDeliveryAddress = await CustomerAddress.update(
        {
          isDeliveryAddress: true
        },
        {
          where: {
            CustomerId: userId,
            id: id
          }
        }
      )
      res.status(200).send({ message: 'Delivery Address updated' })
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  getDeliveryAddress: async (req, res) => {
    try {
      const result = await CustomerAddress.findOne({
        where: {
          CustomerId: req.user.id,
          isDeliveryAddress: true
        },
        include: [
          {
            model: City,
            attributes: ['city'],
            include: [
              {
                model: Province,
                attributes: ['province']
              }
            ]
          }
        ]
      })
      res.status(200).send({ result })
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  }
}
