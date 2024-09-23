const getCities = async () => {
  try {
    const response = await fetch(`${process.env.RAJAONGKIR_BASE_URL}/city`, {
      method: 'GET',
      headers: {
        key: process.env.RAJAONGKIR_APIKEY
      }
    })
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error fetching cities', error)
    throw new Error('Failed to fetch cities')
  }
}

module.exports = getCities
