import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { plus: 0, minus: 50 },
  //    { value: 0 }
  reducers: {
    up: (state, action) => {
      console.log(action);
      // state.value = state.value + action.step;
      state.plus = state.plus + action.payload;
      //    state.value = state.value + action.payload;
      // return {...state, ...} 일반 리듀서
    },

    down: (state, action) => {
      console.log(action);
      state.minus = state.minus - action.payload;
    },
  },
});

export default counterSlice;
