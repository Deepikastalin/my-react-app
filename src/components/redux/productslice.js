import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all products (for dropdown options)
export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      return response.data; // Assuming API returns array of products
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Async thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
      return response.data; // Assuming API returns a product object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

const initialState = {
  list: [],        // Cached list of products
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })

      // fetch single product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        const product = action.payload;
        const existingIndex = state.list.findIndex(p => p.productId === product.productId);
        if (existingIndex !== -1) {
          state.list[existingIndex] = product;
        } else {
          state.list.push(product);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product';
      });
  },
});

export default productSlice.reducer;
