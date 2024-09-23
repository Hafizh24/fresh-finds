import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateGeolocation } from '../redux/geolocationSlice'

export const useGeoLocation = () => {
  const dispatch = useDispatch()
  const { loaded, coordinates } = useSelector((state) => state.geolocation)

  const onSuccess = (location) => {
    dispatch(
      updateGeolocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      })
    )
  }

  const onError = (error) => {
    console.error('Geolocation error:', error)
  }

  useEffect(() => {
    if (!loaded && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }
  }, [dispatch, loaded])

  return { coordinates, loaded }
}
