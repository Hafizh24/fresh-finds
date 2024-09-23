const BASE_URL = 'https://api.rajaongkir.com/starter'

const getProvinces = async () => {
  try {
    const response = await fetch(`${BASE_URL}/province`, {
      method: 'GET',
      headers: {
        key: process.env.RAJAONGKIR_APIKEY
      }
    })
    console.log(response.results)
    const data = await response.json()

    return data
  } catch (error) {
    console.error('Error fetching provinces', error)
    throw new Error('Failed to fetch provinces')
  }
}

module.exports = getProvinces
