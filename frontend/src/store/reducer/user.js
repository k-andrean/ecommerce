import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    cookies: "",
  },
  reducers: {
    setLoginReducer: (state, action) => {
      state.currentUser = action.payload.currentUser;
      state.token = action.payload.token;
      console.log(action.payload.currentUser);
      state.currentRole = action.payload.currentUser.role[0];
    },
    setLogoutReducer: (state) => {
      state.currentUser = null;
      state.currentRole = "";
      state.token = "";
    },
  },
})

export const {
  setLoginReducer,
  setLogoutReducer,
  setRoleReducer,
} = userSlice.actions;

export default userSlice.reducer;