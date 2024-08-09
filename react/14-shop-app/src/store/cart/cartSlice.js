import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: localStorage.getItem("cartProducts")
    ? JSON.parse(localStorage.getItem("cartProducts"))
    : [],
  totalPrice: 0,
  userId: "",
};

const cartSlice = createSlice({
  // 갯수도 같이 집어넣을 것임. 파이어베이스에 집어넣을 요소는 아니라
  // 이건 여기서 관리를 해줄 거임. quantitiy: 1
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.products.push({
        ...action.payload,
        quantitiy: 1,
        total: action.payload.price,
        // 가격이 바뀜에 따라 총액도 자동 변경이 되어야 한다.
        // 그걸 담당하는 게 로컬스토리지다.
      });
      localStorage.setItem("carProducts", JSON.stringify(state.products));
      // 배열에 추가된 상태로 바뀜. 이 스테이트에 넣는 걸로 바뀌니까
    },
  },
});

export default cartSlice.reducer;
export const { addToCart } = cartSlice.actions;
