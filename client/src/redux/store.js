import { configureStore } from '@reduxjs/toolkit'
import adminSlice from './adminSlice'
import customerSlice from './customerSlice'
import cartSlice from './cartSlice'
import productSlice from './productSlice'
import geolocationSlice from './geolocationSlice'
// import geolocationSlice from './geoLocationSlice';

export const store = configureStore({
  reducer: {
    admin: adminSlice,
    customer: customerSlice,
    cart: cartSlice,
    product: productSlice,
    geolocation: geolocationSlice
  }
})
