// store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  lastActivity: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.lastActivity = Date.now();
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.lastActivity = null;
    },
    updateActivity(state) {
      state.lastActivity = Date.now();
    }
  },
});

export const { login, logout, updateActivity } = userSlice.actions;
export default userSlice.reducer;
