// employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllEmployees = createAsyncThunk(
  'employee/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:2105/api/employees');
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch employees');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    allEmployees: [],
    data: null,
    isAuthenticated: false,
    lastActivity: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.data = null;
      state.isAuthenticated = false;
      state.lastActivity = null;
      state.error = null;
    },
    updateActivity: (state) => {
      state.lastActivity = Date.now();
    },
    loginSuccess: (state, action) => {
      state.data = action.payload;
      state.isAuthenticated = true;
      state.lastActivity = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.allEmployees = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateActivity, loginSuccess } = employeeSlice.actions;
export default employeeSlice.reducer;
