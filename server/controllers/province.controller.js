const db = require('../models')
const Province = db.Province
const getProvinces = require('../services/getProvince')

module.exports = {
  fetchProvinces: async (req, res) => {
    try {
      const provinces = await getProvinces()
      const formattedProvinces = provinces.rajaongkir.results.map((province) => ({
        province_id: province.province_id,
        name: province.province
      }))

      const result = await Province.bulkCreate(formattedProvinces)

      res.status(200).send({ message: 'Provinces data created successfully', result: result })
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  },
  getAllProvinces: async (req, res) => {
    try {
      const result = await Province.findAll()
      res.status(200).send({ result })
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }
}
