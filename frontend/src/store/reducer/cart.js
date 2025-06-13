import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  items: [],
  totalAmount: 0,
  shippingPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setShippingPrice: (state, action) => {
      state.shippingPrice = action.payload;
      state.totalAmount =
        state.items.reduce((total, item) => total + item.totalPrice, 0) +
        state.shippingPrice;
    },
    addToCart: (state, action) => {
      const { product, quantity, userId } = action.payload;
      state.userId = userId;

      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice += product.price * quantity;
      } else {
        state.items.push({
          ...product,
          quantity,
          totalPrice: product.price * quantity,
        });
      }

      state.totalAmount =
        state.items.reduce((total, item) => total + item.totalPrice, 0) +
        state.shippingPrice;
    },
    removeFromCart: (state, action) => {
      const { productId, userId } = action.payload;
      if (state.userId !== userId) {
        console.warn("User ID mismatch! Cannot remove quantity for this cart.");
        return;
      }

      state.items = state.items.filter((item) => item.id !== productId);
      state.totalAmount =
        state.items.reduce((total, item) => total + item.totalPrice, 0) +
        state.shippingPrice;
    },
    updateQuantity: (state, action) => {
      const { productId, quantity, userId } = action.payload;
      if (state.userId !== userId) {
        console.warn("User ID mismatch! Cannot update quantity for this cart.");
        return;
      }

      const existingItem = state.items.find((item) => item.id === productId);

      if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
        state.totalAmount =
          state.items.reduce((total, item) => total + item.totalPrice, 0) +
          state.shippingPrice;
      }
    },
    clearCart: (state) => {
      state.userId = null;
      state.items = [];
      state.totalAmount = 0;
      state.shippingPrice = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setShippingPrice,
  setUserId,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
