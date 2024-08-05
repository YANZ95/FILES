import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection } from "firebase/firestore";

const diarySlice = createSlice({
  name: "diary",
  initialState: {
    items: [],
    error: null,
    status: "welcome",
  },
  reducers: {
    // 비동기 아닌 거 작업해주는 애
  },
  extraReducers: (builder) => {
    // 비동기작업은 .actionCreator 를 자동으로 만들어주지 못한다.
    // 그래서 아래에 임의로 만들어준 거임
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = "Loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        // fulfilled -> 완료된 상태
        state.items = action.payload;
        state.status = "complete";
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "fail";
      });
  },
});

const fetchItems = createAsyncThunk(
  "items/fetchAllItems",
  async (collectionName) => {
    try {
      const resultData = await getDatas(collectionName);
      // dispatchEvent({type: "FETCH_ITEM", payload: resultData});
      return resultData;
    } catch (error) {
      console.log("FETCH Error: ", error);
    }
  }
);
// 원래 비동기 함수 관리하는 게 굉장히 까다로운데 패치아이템 함수 쓰면 편해짐

export default diarySlice;
export { fetchItems };
// export const {fetchItems} = diarySlice.actions
// 위에서 만들어줘서 그대로 빼오기만 하면 됨
