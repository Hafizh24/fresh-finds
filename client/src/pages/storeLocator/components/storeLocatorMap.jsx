import PropTypes from 'prop-types'
import { useEffect } from 'react'

import lemonLogo from '../../../assets/lemon-logo.svg'

export const StoreLocatorMap = ({ selectedStore }) => {
  // console.log(selectedStore.latitude, selectedStore.longitude);

  useEffect(() => {}, [selectedStore])

  const mapUrl = `https://maps.google.com/maps?q=${selectedStore?.latitude},${selectedStore?.longitude}&output=embed&z=17`

  return (
    <div className="relative h-full">
      <div className="w-full h-full" id="gmap-frame">
        <iframe className="rounded-lg" width="100%" height="100%" src={mapUrl}></iframe>
      </div>
      <div className="absolute bottom-2 left-2 lg:bottom-auto lg:left-auto lg:top-5 lg:right-5 bg-white border border-gray-50 flex p-3 rounded-lg items-center gap-2 shadow-md">
        <img src={lemonLogo} alt="" className="h-[1.4rem] w-[1.4rem] object-cover" />
        <span className="text-[17px] font-semibold text-[#343538]">{selectedStore?.name}</span>
      </div>
    </div>
  )
}

StoreLocatorMap.propTypes = {
  selectedStore: PropTypes.shape({
    name: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  }).isRequired
}
