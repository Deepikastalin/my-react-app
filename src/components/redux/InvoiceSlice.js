import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to submit invoice
export const submitInvoiceAsync = createAsyncThunk(
  'invoice/submitInvoiceAsync',
  async (_, { getState, rejectWithValue }) => {
    const { invoiceItems, customerInfo, employeeInfo } = getState().invoice;

    try {
      const invoicePayload = {
        invoiceNumber: null,
        customerId: customerInfo.customerId,
        employeeId: employeeInfo.empId || 'EMP001',
        billAmount: invoiceItems.reduce(
          (total, item) => total + parseFloat(item.price) * parseInt(item.quantity),
          0
        ),
        dueDate: new Date().toISOString().split("T")[0],
        invoiceDate: new Date().toISOString().split("T")[0],
        createdBy: 'admin',
        createdDate: new Date().toISOString(),
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString(),
        products: invoiceItems.map((item) => ({
          id: null,
          invoiceId: null,
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          totalPrice: parseFloat(item.price) * parseInt(item.quantity),
        })),
      };

      console.log('Submitting invoice data:', invoicePayload);

      const response = await axios.post('http://localhost:8083/invoice', invoicePayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Submit invoice error:', error);

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Server error');
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message || 'Failed to submit invoice');
      }
    }
  }
);

// Initial state
const initialState = {
  invoiceItems: [],
  employeeInfo: {},
  customerInfo: {},
  summary: {
    subtotal: 0,
    tax: 0,
    total: 0,
  },
  status: 'idle',
  error: null,
};

// Invoice slice
const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setCustomerInfo: (state, action) => {
      state.customerInfo = action.payload;
    },
    setEmployeeInfo: (state, action) => {
      state.employeeInfo = action.payload;
    },
    addOrUpdateInvoiceItem: (state, action) => {
      const { productId, productName, quantity, price, taxPercent } = action.payload;
      const total = price * quantity;
      const taxAmount = (total * taxPercent) / 100;

      const newItem = {
        productId,
        productName,
        quantity,
        price,
        total,
        taxPercent,
        taxAmount,
      };

      const idx = state.invoiceItems.findIndex(i => i.productId === productId);
      if (idx !== -1) {
        const combinedQty = state.invoiceItems[idx].quantity + quantity;
        state.invoiceItems[idx] = {
          ...newItem,
          quantity: combinedQty,
          total: price * combinedQty,
          taxAmount: (price * combinedQty * taxPercent) / 100,
        };
      } else {
        state.invoiceItems.push(newItem);
      }

      invoiceSlice.caseReducers.updateSummary(state);
    },
    updateInvoiceItem: (state, action) => {
      const { index, quantity, price } = action.payload;
      if (state.invoiceItems[index]) {
        const item = state.invoiceItems[index];
        item.quantity = quantity;
        item.price = price;
        item.total = quantity * price;
        item.taxAmount = (item.total * item.taxPercent) / 100;
        invoiceSlice.caseReducers.updateSummary(state);
      }
    },
    removeInvoiceItem: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.invoiceItems.length) {
        state.invoiceItems.splice(index, 1);
        invoiceSlice.caseReducers.updateSummary(state);
      }
    },
    deleteInvoiceItem: (state, action) => {
      state.invoiceItems.splice(action.payload, 1);
      invoiceSlice.caseReducers.updateSummary(state);
    },
    updateSummary: (state) => {
      const subtotal = state.invoiceItems.reduce((sum, item) => sum + item.total, 0);
      const tax = state.invoiceItems.reduce((sum, item) => sum + item.taxAmount, 0);
      state.summary = {
        subtotal,
        tax,
        total: subtotal + tax,
      };
    },
    clearInvoice: (state) => {
      state.invoiceItems = [];
      state.summary = { subtotal: 0, tax: 0, total: 0 };
      state.customerInfo = {};
      state.employeeInfo = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitInvoiceAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitInvoiceAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        invoiceSlice.caseReducers.clearInvoice(state);
      })
      .addCase(submitInvoiceAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  addOrUpdateInvoiceItem,
  updateInvoiceItem,
  removeInvoiceItem,
  deleteInvoiceItem,
  setCustomerInfo,
  setEmployeeInfo,
  updateSummary,
  clearInvoice,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
