import { configureStore } from '@reduxjs/toolkit';
import invoiceReducer from './InvoiceSlice';
import productReducer from './productslice';
import employeeReducer from './employeeSlice';
import customerReducer from './customerSlice';
import userReducer from "./userSlice";
export const store = configureStore({
  reducer: {
    invoice: invoiceReducer,
    product: productReducer,
    employee: employeeReducer,
    customer: customerReducer,
    user: userReducer
  },
});
export default store;