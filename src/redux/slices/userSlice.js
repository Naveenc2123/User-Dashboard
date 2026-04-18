import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
    },

    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },

    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (u) => u._id === action.payload._id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter(
        (u) => u._id !== action.payload
      );
    }
  }
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  addUser,
  updateUser,
  deleteUser
} = userSlice.actions;

export default userSlice.reducer;