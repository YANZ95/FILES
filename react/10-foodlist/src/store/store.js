import { configureStore } from "@reduxjs/toolkit";
<<<<<<< HEAD


const store = configureStore({
    reducer: {},
});

export default store;
=======
import foodSlice from "./foodSlice";

const store = configureStore({
  reducer: {
    food: foodSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // () => 변수명 아무거나 지어도 되는데 의미있는 걸로 지음
    getDefaultMiddleware({ serializableCheck: false }),
  // 라스트쿼리를 가져오고 싶으면 라스트쿼리 덕아이디 불러옴
});

export default store;
>>>>>>> 06d1211afd90f6d3dbc541724032b8c20a1b64bf
