import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: '',
  username: '',
  token:'',
  expire: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      const { userId, username, token, expire } = action.payload;
      state.userId = userId;
      state.username = username;
      state.token = token;
      // Calculate expiration date based on the "expire" string (e.g., "2d")
      const days = parseInt(expire, 10); // Parse the numeric part (e.g., 2 from "2d")
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days); // Add days to the current date

      // Store as a timestamp for easy comparison
      state.expire = expirationDate.getTime();
    },
    logout(state) {
      state.userId = '';
      state.username = '';
      state.token = '';
      state.expire= '';
    },
  },
});

// Export the actions
export const { login, logout } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;