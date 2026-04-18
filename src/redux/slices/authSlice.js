import { createSlice } from "@reduxjs/toolkit";

const savedAuth = JSON.parse(localStorage.getItem("auth"));

const initialState = savedAuth || {
  isAuthenticated: false,
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;

      // ✅ Save only required data
      localStorage.setItem("auth", JSON.stringify({
        isAuthenticated: true,
        user: action.payload
      }));
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem("auth");
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;