import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: ['Apple', 'Banana', 'Orange'],  // Initial items
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

export const { addItem } = itemsSlice.actions;
export default itemsSlice.reducer;
