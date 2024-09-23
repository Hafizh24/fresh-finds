import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {}
}
console.log('initialState', initialState.value)

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setDataAdmin: (state, action) => {
      state.value = action.payload

      console.log('adminSlice', state.value)
    }
  }
})

export const { setDataAdmin } = adminSlice.actions

export default adminSlice.reducer
