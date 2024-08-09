import { createSlice } from "@reduxjs/toolkit";

const initialState = DetailPageName.All;

const DetailPageSlice = createSlice({
  name: "DetailPage",
  initialState,
  reducers: {
    setActiveDetailPage: (state, action) => {
      return action.payload;
    },
  },
});
