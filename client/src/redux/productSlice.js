import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setNearestBranchProduct: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setNearestBranchProduct } = productSlice.actions;

export default productSlice.reducer;
