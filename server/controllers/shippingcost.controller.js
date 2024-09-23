require('dotenv').config()

module.exports = {
  calculateShippingCost: async (req, res) => {
    try {
      const { originCityId, destinationCityId, weight, courier } = req.body

      const response = await axios.post(
        'https://api.rajaongkir.com/starter/cost',
        {
          origin: originCityId,
          destination: destinationCityId,
          weight: weight,
          courier: courier
        },
        {
          headers: {
            key: process.env.RAJAONGKIR_APIKEY
          }
        }
      )

      const shippingcost = response.data.rajaongkir.results
      res.status(200).send({ shippingcost })
    } catch (error) {
      console.error(error)
      res.status(error.response?.status || 500).send({
        message: error.response?.data?.rajaongkir?.status?.description || 'Failed to calculate shipping cost'
      })
    }
  }
}
