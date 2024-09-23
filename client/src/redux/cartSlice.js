import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  totalProduct: null,
  order_id: '',
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemInCart = state.data.find(
        (item) => item.id === action.payload.id,
      );
      console.log("ITEM IN CART", itemInCart);
      if (itemInCart) {
        itemInCart.quantity++;
      } else {
        state.data.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    subtractQuantity: (state, action) => {
      const itemInCart = state.data.find(
        (item) => item.id === action.payload.id,
      );
      if (itemInCart.quantity === 1) {
        state.data = state.data.filter((item) => item.id !== action.payload.id);
      } else {
        itemInCart.quantity--;
      }
    },
    addTotal: (state, action) => {
      state.totalProduct = action.payload;
    },
    setOrderId: (state, action) => {
      console.log('order ID>>>>>', action.payload);
      state.order_id = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  subtractQuantity,
  addTotal,
  setOrderId,
} = cartSlice.actions;

export default cartSlice.reducer;
