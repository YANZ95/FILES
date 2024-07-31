import { act, useReducer, useState } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "PLUS":
      return { count: state.count + 1 };
    case "MINUS":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const initialState = { count: 0 };

function ReducerTest() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // {리듀서함수, state 값의 초기값}
  // const [count, setCount] = useState(0);
  // count를 +1 한 후에 App 컴포넌트 (코드) 재실행(재랜더링)

  // const handlePlus = () => {
  //   setCount(count + 1);
  // };
  // const handleMinus = () => {
  //   setCount(count - 1);
  // }; -> 챗 지피티 풀이

  // 리듀서 왜 쓰는 가?
  // 우리가 쓰는 사이트는 크기가 작아서 효과가 작아 보인다
  // --> 1. 예측 가능: 상태 변경이 예측 가능하고 일관성 있게 이루어진다.
  // 2. 중앙 집중화된 관리: 여러 상태를 하나의 리듀서에게 관리를 하거나, 여러 리듀서를 조합하여
  // 관리를 할 수가 있다. 모든 상태 변경이 하나의 통로(dispatch를 통한 액션 전달)
  // 상태 관리의 복잡성이 줄어들고, 상태 변경이 어디에서 이루어지는 지를 쉽게 추적할 수 있다.
  // (dispatch만 찾으면 쉽게 찾고 관리할 수가 있음)
  // 그 외에도 장점이 몇 더 있으나 생략함. 직접 써보고 천천히 느껴보길 바람
  // 이게 끝임
  // 여러 상태를 관리를 할 때 하나의 dispatch으로 관리할 수 있으나 그게 힘드면
  // dispatch를 여러 개 만들어 관리를 한다.

  return (
    <div className="ReducerTest">
      <p>Count: {state.count}</p>
      {/* <button onClick={handlePlus}>plus</button> */}
      <button onClick={() => dispatch({ type: "PLUS" })}>plus</button>
      <button onClick={() => dispatch({ type: "MINUS" })}>minus</button>
      {/* <button onClick={() => setCount(count + 1)}>plus</button>
      <button onClick={() => setCount(count - 1)}>minus</button> */}
    </div>
  );
}

export default ReducerTest;
