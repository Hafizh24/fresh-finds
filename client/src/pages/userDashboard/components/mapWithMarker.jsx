import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

export const MapWithMarker = ({ coordinates, setAddress, setCoordinates }) => {
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: coordinates,
      zoom: 17
    })

    const marker = new window.google.maps.Marker({
      position: coordinates,
      map: map,
      draggable: true
    })

    // Update marker position on dragedd
    marker.addListener('dragend', () => {
      const newPosition = marker.getPosition()
      setCoordinates({ lat: newPosition.lat(), lng: newPosition.lng() })

      // Reverse geocode to get address from new coordinates
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            setAddress(results[0].formatted_address)
          }
        }
      })
    })

    markerRef.current = marker
  }, [coordinates, setAddress, setCoordinates])

  return <div ref={mapRef} style={{ width: '100%' }} className="h-[230px] lg:h-[300px]" />
}

MapWithMarker.propTypes = {
  coordinates: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }).isRequired,
  setAddress: PropTypes.func.isRequired,
  setCoordinates: PropTypes.func.isRequired
}
