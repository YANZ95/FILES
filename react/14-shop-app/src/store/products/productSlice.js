import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getData } from "../../firebase";
import { getDataRest } from '../../api';

const initialState = {
  product: {},
  //   하나니까 배열이 아니라 객체로 바꿘다. 대괄호에서 중괄호로 바꿈
  isLoading: false,
  error: "",
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  // async ({ collectionName, queryOptions }) => {
    async ({ collectionName }) => {
    try {
      // const resultData = await getData(collectionName, queryOptions);
      const resultData = await getDataRest(collectionName);
      return resultData;
    } catch (error) {
      return null;
    }
  }
);

export default productSlice.reducer;
export { fetchProduct };
