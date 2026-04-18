import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  sortBy: "",
  gender: "all",
  company: "all",
  fruit: "all",
  ageRange: "all",   // ✅ add this
  status: "all"      // ✅ add this
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },

    setSort: (state, action) => {
      state.sortBy = action.payload;
    },

    setFilter: (state, action) => {
      return { ...state, ...action.payload };
    },

    resetFilters: () => initialState
  }
});

export const {
  setSearch,
  setSort,
  setFilter,
  resetFilters
} = filterSlice.actions;

export default filterSlice.reducer;