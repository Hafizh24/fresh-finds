const getCities = require('../services/getCity')
const { City } = require('../models')

module.exports = {
  fetchCities: async (req, res) => {
    try {
      const cities = await getCities()
      const formattedCities = cities.rajaongkir.results.map((city) => ({
        city_id: city.city_id,
        name: city.city_name,
        province_id: city.province_id,
        type: city.type,
        postal_code: city.postal_code
      }))

      const result = await City.bulkCreate(formattedCities)

      res.status(200).send({ message: 'Cities data created successfully', result: result })
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  },
  getAllCities: async (req, res) => {
    try {
      const result = await City.findAll()
      res.status(200).send({ result })
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }
}
