import { createSlice } from '@reduxjs/toolkit';

// Initial state for the cart
const initialState = {
  userId: null, // Store the user ID here
  items: [],
  totalAmount: 0,
  shippingPrice: 0, // Default shipping price
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setShippingPrice: (state, action) => {
      state.shippingPrice = action.payload; // Set the shipping price
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0) + state.shippingPrice;
    },
    addToCart: (state, action) => {
      const { product, quantity, userId } = action.payload;
      state.userId = userId;  // Set user ID when adding items

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

      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0) + state.shippingPrice;
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0) + state.shippingPrice;
    },
    updateQuantity: (state, action) => {
      const { productId, quantity, userId } = action.payload;

      // Check if the userId matches before proceeding
      if (state.userId !== userId) {
        console.warn('User ID mismatch! Cannot update quantity for this cart.');
        return;  // Exit early if the user ID doesn't match
      }

      const existingItem = state.items.find((item) => item.id === productId);

      if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
        state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0) + state.shippingPrice;
      }
    },
    clearCart: (state) => {
        // Reset cart state to initial state
        state.userId = null;
        state.items = [];
        state.totalAmount = 0;
        state.shippingPrice = 0;
    },
  },
});

// Export actions
export const { addToCart, removeFromCart, updateQuantity, setShippingPrice, setUserId, clearCart } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;