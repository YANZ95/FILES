import React, { useReducer } from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import counterSlice from "./counterSlice";
import { store } from "./store";

// const counterSlice = createSlice({
//   name: "counter",
//   initialState: { value: 0 },
//   reducers: {
//     up: (state, action) => {
//       console.log(action);
//       state.value = state.value + action.payload;
//       // return {...state, ...} 일반 리듀서
//     },
//   },
// });

// function reducer(state, action) {
//   if (action.type === "up") {
//     return { ...state, value: state.value + action.step };
//   }
//   return state;
// }
// const initialState = { value: 0 };

// const store = configureStore({
//   reducer: counterSlice.reducer,
//   // s 붙이면 안 됨. 리듀서가 필요하다는 의미
//   //
// }); 스토어로 이동

function Counter() {
  // const [state, dispatch] = useReducer(reducer, initialState);
  const dispatch = useDispatch();
  // const count = useSelector((state) => {
  //   return state.value;
  //   // 스테이트 안에 들어있는 벨류
  // });
  const plus = useSelector((state) => state.plus);
  const minus = useSelector((state) => state.minus);
  return (
    <>
      <div>
        <button
          onClick={() => {
            // dispatch({ type: 'up', step: 2 })
            // dispatch({ type: 'counter/up', step: 2 })
            // dispatch(counterSlice.actions.up(2));
            dispatch(up(2));
          }}
        >
          +
        </button>
        {/* {state.value} */}
        {plus}
        {/* {count} */}
      </div>

      <div>
        <button
          onClick={() => {
            dispatch(down(2));
          }}
        >
          -
        </button>
        {/* {state.value} */}
        {minus}
        {/*   {count} */}
      </div>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Counter></Counter>
      </div>
    </Provider>
  );
}

export default App;
export const { up } = counterSlice.actions;
// 반환되는 모양이 다르다.
export const { down } = counterSlice.actions;
