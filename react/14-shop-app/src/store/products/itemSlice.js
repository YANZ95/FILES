import { configureStore, createSlice } from '@reduxjs/toolkit';

// Create a slice for managing item heights
const itemSlice = createSlice({
  name: 'items',
  initialState: {
    maxHeight: 0,
  },
  reducers: {
    setMaxHeight: (state, action) => {
      state.maxHeight = action.payload;
    },
  },
});

// Export actions and reducer
export const { setMaxHeight } = itemSlice.actions;
export default itemSlice.reducer;

// Configure the Redux store
const store = configureStore({
  reducer: {
    items: itemSlice.reducer,
  },
});

export { store };
