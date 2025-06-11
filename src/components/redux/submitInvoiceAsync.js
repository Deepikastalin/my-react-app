import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to submit the invoice
export const submitInvoiceAsync = createAsyncThunk(
  'invoice/submitInvoiceAsync',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();

    // Use customer and employee info either from invoice slice or separate slices
    // Change these if your app structure differs:
    const customerInfo = state.customer?.data || state.invoice.customerInfo;
    const employeeInfo = state.employee?.data || state.invoice.employeeInfo;
    const invoiceItems = state.invoice.invoiceItems;
    const summary = state.invoice.summary;

    if (!customerInfo || !employeeInfo) {
      return rejectWithValue('Missing customer or employee information');
    }

    // Build the invoice data exactly like your example JSON
    const invoiceData = {
      invoice: {
        invoiceNumber: 1, // or generate dynamically like nanoid(6)
        customerId: customerInfo.customerId,
        employeeId: employeeInfo.empId,
        billAmount: summary.total,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        invoiceDate: new Date().toISOString().slice(0, 10),
        createdBy: 'admin',
        createdDate: new Date().toISOString(),
        modifiedBy: 'admin',
        modifiedDate: new Date().toISOString(),
        products: invoiceItems.map(item => ({
          productId: item.productId,
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.total,
        })),
      },
      employee: employeeInfo,
      customer: customerInfo,
      trackingId: nanoid(), // optional, if you want unique tracking
      products: invoiceItems.map(item => ({
        productId: item.productId,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.total,
      })),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/invoices', invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to submit invoice');
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
      const { productId, productName, quantity, price, taxPercent = 0 } = action.payload;
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
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitInvoiceAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitInvoiceAsync.fulfilled, (state) => {
        state.status = "succeeded";
        invoiceSlice.caseReducers.clearInvoice(state);
      })
      .addCase(submitInvoiceAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const {
  addOrUpdateInvoiceItem,
  deleteInvoiceItem,
  updateSummary,
  clearInvoice,
  setCustomerInfo,
  setEmployeeInfo,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
