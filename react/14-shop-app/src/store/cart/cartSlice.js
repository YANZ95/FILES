import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addCart,
  syncCart,
  deleteDatas,
  updateTotalAndQuantity,
  createOrder,
} from '../../firebase';
import { addDatasRest, deleteDatasRest, deleteDatasRestBatch } from '../../api';


const initialState = {
  products: localStorage.getItem("cartProducts")
    ? JSON.parse(localStorage.getItem("cartProducts"))
    : [],
  totalPrice: 0,
  userId: "",
};

const cartSlice = createSlice({
  // 쇼핑 카트 관리 시스템의 두뇌
  // 갯수도 같이 집어넣을 것임. 파이어베이스에 집어넣을 요소는 아니라
  // 이건 여기서 관리를 해줄 거임. quantitiy: 1
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // 사용자가 상품을 장바구니에 추가할 때 호출
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
    deleteFromCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
      localStorage.setItem('cartProducts', JSON.stringify(state.products));
    },
    syncCartAndSlice: (state, action) => {
      state.products = action.payload;
      localStorage.setItem('cartProducts', JSON.stringify(state.products));
    },
    getTotalPrice: (state) => {
      // 장바구니에 담긴 모든 상품의 총 가격을 계산해줌
      state.totalPrice = state.products.reduce(
        // 리듀스 함수 사용함 
        (acc, product) => (acc += product.total),
        0
      );
      // 하나의 값으로 나오는 거 => reduce
      // reduce 쓸 때 뒤에 0 붙이는 거 항상 신경 써줘야 됨
    },
    incrementProduct: (state, action) => {
      // 특정 상품의 수량을 증가시킴
      const index = state.products.findIndex(
        (product) => product.id === action.payload
      );
      state.products[index].quantity += 1;
      state.products[index].total += state.products[index].price;
      localStorage.setItem('cartProducts', JSON.stringify(state.products));
    },
    decrementProduct: (state, action) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload
      );
      state.products[index].quantity -= 1;
      state.products[index].total -= state.products[index].price;
      localStorage.setItem('cartProducts', JSON.stringify(state.products));
    },
    sendOrder: (state) => {
      state.products = [];
      localStorage.setItem('cartProducts', JSON.stringify(state.products));
    },
  },
});

export const syncCartAndStorage = createAsyncThunk(
  'cart/asyncCartItem',
  async ({ uid, cartItems }, thunkAPI) => {
    try {
      const result = await syncCart(uid, cartItems);
      thunkAPI.dispatch(syncCartAndSlice(result));
    } catch (error) {
      console.error(error);
    }
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async ({ collectionName, product }, thunkAPI) => {
    try {
      await thunkAPI.dispatch(addToCart(product));
      // const products = thunkAPI.getState().cartSlice.products;
      const {
        cartSlice: { products },
      } = thunkAPI.getState();
      const addItem = products.find(
        (sliceProduct) => sliceProduct.id === product.id
      );
      await addCart(collectionName, addItem);
    } catch (error) {}
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ collectionName, productId }, thunkAPI) => {
    try {
      // const resultData = await deleteDatas(collectionName, productId);
      const resultData = await deleteDatasRest(collectionName + productId);
      if (resultData) {
        thunkAPI.dispatch(deleteFromCart(productId));
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Error Delete CartItem');
    }
  }
);

export const calculateTotalAndQuantity = createAsyncThunk(
  'cart/cartItemCalculate',
  async ({ uid, productId, operator }, thunkAPI) => {
    try {
      await updateTotalAndQuantity(uid, productId, operator);
      if (operator === 'increment') {
        thunkAPI.dispatch(incrementProduct(productId));
      } else {
        thunkAPI.dispatch(decrementProduct(productId));
      }
    } catch (error) {
      console.error(error);
    }
  }
);

export const postOrder = createAsyncThunk(
  'cart/createOrder',
  async ({ uid, cart }, thunkAPI) => {
    try {
      // createOrder 함수 호출
      // const result = await createOrder(uid, cart);
      const orderObj = {
        cancelYn: 'N',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        ...cart,
      };

      const result = await addDatasRest(
        `/users/${uid}/orders/${crypto.randomUUID().slice(0, 20)}`,
        orderObj
      );

      const deleteResult = await deleteDatasRestBatch(
        `users/${uid}/cart`,
        cart.products
      );

      if (!result) {
        return;
      }
      // cartSlice 의 products 초기화 및 로컬스토리지 초기화
      thunkAPI.dispatch(sendOrder());
    } catch (error) {
      console.error(error);
    }
  }
);

export default cartSlice.reducer;
export const {
  addToCart,
  deleteFromCart,
  syncCartAndSlice,
  getTotalPrice,
  incrementProduct,
  decrementProduct,
  sendOrder,
} = cartSlice.actions;