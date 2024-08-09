import { createSlice } from "@reduxjs/toolkit";
import { CategoriesName } from "./categories";

const initialState = CategoriesName.All;
// 스테이트 값, CategoriesName.All => 단일 값

const categoriesSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      return action.payload;
      // 리액트 때는 객체로 넣어줬으나 값을 넣어줬기에 값을 그대로 넣어준다.
    },
  },
});

export default categoriesSlice.reducer;

export const { setActiveCategory } = categoriesSlice.actions;
// 슬라이스를 통해 나온 녀석이 변수에 담긴 게 (속성) 액션에 들어감
// 그냥 익스포트만 들어간거는 밖에서 만들어진 변수가 들어간거임
// 그 함수를 밖에서 쓰냐 안에서 쓰냐의 차이점
