import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  username: "",
  token: "",
  expire: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      const { userId, username, token, expire } = action.payload;
      state.userId = userId;
      state.username = username;
      state.token = token;

      const days = parseInt(expire, 10);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      state.expire = expirationDate.getTime();
    },
    logout(state) {
      state.userId = "";
      state.username = "";
      state.token = "";
      state.expire = "";
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
