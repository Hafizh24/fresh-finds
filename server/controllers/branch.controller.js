const { Branch, Admin, City, Province } = require('../models')
const { Op } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = {
  getAll: async (req, res) => {
    try {
      const { page, search } = req.query
      const limit = 5
      const offset = (page - 1) * limit

      const whereClause = {
        isDeleted: false
        // isActive: true
      }

      if (search) {
        whereClause[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { address: { [Op.like]: `%${search}%` } }]
      }

      const result = await Branch.findAndCountAll({
        where: whereClause,
        order: [
          ['isSuperStore', 'DESC'],
          ['createdAt', 'DESC']
        ],
        include: [
          {
            model: Admin,
            attributes: ['name', 'username', 'email']
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
  getSuperStore: async (req, res) => {
    try {
      const result = await Branch.findOne({
        where: {
          isSuperStore: true
        }
      })
      res.status(200).send({ result })
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  getById: async (req, res) => {
    try {
      const result = await Branch.findOne({
        where: {
          id: req.params.id
        },
        include: [
          {
            model: Admin,
            attributes: ['name', 'username', 'email']
          },
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
  },
  getAllbyAdminId: async (req, res) => {
    try {
      const { id } = req.query
      const findBranches = await Branch.findAll({
        where: {
          AdminId: id
        }
      })

      if (!findBranches || findBranches.count === 0) {
        return res.status(404).send({ message: "You're not assigned to any branches" })
      }

      return res.status(200).send({ result: findBranches })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  addBranch: async (req, res) => {
    try {
      const { name, address, contactNumber, latitude, longitude, AdminId, fullAddress, province_id, CityId, maxDeliveryDistance } = req.body

      const findBranch = await Branch.findOne({
        where: {
          address,
          AdminId: AdminId
        }
      })

      const findBranchAdmin = await Branch.findOne({
        where: {
          AdminId: AdminId
        }
      })

      if (findBranchAdmin) {
        return res.status(400).send({ message: "The administrator you've chosen is already registered, please select another administrator" })
      }

      if (findBranch == null && findBranchAdmin == null) {
        const result = await Branch.create({
          ...req.body
        })

        return res.status(200).send({ message: 'Success adding a new branch', result: result })
      } else {
        console.log('Branch with this address is already listed')
        return res.status(400).send({ message: 'Branch with this address is already listed' })
      }
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  editBranch: async (req, res) => {
    try {
      const { name, address, contactNumber, latitude, longitude, AdminId, fullAddress, province_id, CityId, maxDeliveryDistance } = req.body

      await Branch.update(
        {
          ...req.body
        },
        {
          where: {
            id: req.params.id
          }
        }
      )

      res.status(200).send({ message: 'Success updating branch' })
      // const findBranch = await Branch.findOne({
      //     where: {
      //         address
      //     }
      // })

      // if (findBranch == null) {
      //     await Branch.update({
      //         ...req.body,
      //     }, {
      //         where: {
      //             id: req.params.id,
      //         }
      //     })
      //     return res.status(200).send({ message: "Success updating branch" })
      // } else {
      //     return res.status(400).send({ message: "This address has been listed" })
      // }
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  changeStatus: async (req, res) => {
    try {
      const branchData = await Branch.findOne({
        where: {
          id: req.params.id
        }
      })

      if (branchData) {
        const updatedStatus = !branchData.isActive

        await branchData.update({ isActive: updatedStatus })
        return res.status(200).send({ message: 'Branch status updated' })
      } else {
        return res.status(404).send({ message: 'Branch not found' })
      }
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  deleteById: async (req, res) => {
    try {
      const branchData = await Branch.findOne({
        where: {
          id: req.params.id
        }
      })

      if (branchData) {
        await branchData.update({ isDeleted: true })
        return res.status(200).send({ message: 'Branch Deleted' })
      } else {
        return res.status(400).send({ message: 'Branch not found' })
      }
    } catch (error) {
      console.error(error)
      res.status(400).send({ message: error.message })
    }
  },
  getNearestBranch: async (req, res) => {
    try {
      const { latitude, longitude, limit } = req.query

      const parsedLimit = Number.isInteger(parseInt(limit, 10)) ? parseInt(limit, 10) : null

      const nearestBranch = await Branch.findAll({
        attributes: [
          'id',
          'name',
          'longitude',
          'latitude',
          'address',
          'contactNumber',
          'maxDeliveryDistance',
          'CityId',
          [Sequelize.fn('ST_Distance_Sphere', Sequelize.literal(`point(${longitude}, ${latitude})`), Sequelize.literal('point(longitude, latitude)')), 'distance']
        ],
        where: {
          isActive: true,
          isDeleted: false
        },
        order: [[Sequelize.fn('ST_Distance_Sphere', Sequelize.literal(`point(${longitude}, ${latitude})`), Sequelize.literal('point(longitude, latitude)')), 'ASC']],
        limit: parsedLimit
      })

      const result = nearestBranch

      res.status(200).send({ result: result, distance: result ? result.distance : null })
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  },
  getTotalBranch: async (req, res) => {
    try {
      const totalBranch = await Branch.count()
      res.status(200).send({ totalBranch })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  },
  getAllBranch: async (req, res) => {
    try {
      const result = await Branch.findAll()
      res.status(200).send({ result: result })
    } catch (err) {
      console.error(error)
      return res.status(500).send({ message: error.message })
    }
  }
}
