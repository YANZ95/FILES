import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./counterSlice";

export const store = configureStore({
  reducer: counterSlice.reducer,
  // s 붙이면 안 됨. 리듀서가 필요하다는 의미
});
