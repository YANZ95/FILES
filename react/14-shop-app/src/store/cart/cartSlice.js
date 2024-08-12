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
    getTotalPrice: (state) => {
      state.totalPrice = state.products.reduce(
        // 리듀스 함수 사용함 
        (acc, product) => (acc += product.total),
        0
      );
      // 하나의 값으로 나오는 거 => reduce
      // reduce 쓸 때 뒤에 0 붙이는 거 항상 신경 써줘야 됨
    },
    incrementProduct: (state, action) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload
      );
      state.products[index].quantity += 1;
      state.products[index].total += state.products[index].price;
    },
  },
});

export default cartSlice.reducer;
export const { addToCart, getTotalPrice, incrementProduct } = cartSlice.actions;
