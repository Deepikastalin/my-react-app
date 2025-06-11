// src/redux/customerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Replace with your backend API endpoint
export const fetchAllCustomers = createAsyncThunk(
  "customer/fetchAll",
  async () => {
    const response = await axios.get("http://localhost:8081/api/customers"); // adjust the endpoint
    return response.data;
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default customerSlice.reducer;
