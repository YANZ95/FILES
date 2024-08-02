import { addDatas, getDatas, updateDatas } from "./firebase";
import { collection } from "firebase/firestore";

// action types
const FETCH_ITEMS = "FETCH_ITEMS";
const ADD_ITEM = "ADD_ITEM";
const UPDATE_ITEM = "UPDATE_ITEM";
const DELETE_ITEM = "DELETE_ITEM";
const SET_ERROR = "SET_ERROR";

// initial state
export const initialState = {
  items: [],
  error: null,
  loading: false,
};

export function reducer(state, action) {
  // state는 우리가 dispatch 함수를 호출할 때 명시적으로 건네주지 않아도
  // 리듀서가 알아서 관리를 하고 있다.
  // dispatch 함수를 호출할 때 넣어주는 객체가 action 으로 들어온다.
  switch (action.type) {
    case FETCH_ITEMS:
      return { ...state, items: action.payload, error: null };
    case ADD_ITEM:
      return { ...state, items: [...state.items, action.payload], error: null };
    // 교체되는 게 아니라 아예 새로운 걸로 바뀜. 리듀서는 순수함수임
    // 기존에 있던 state가 아니라 새로운 state로 바꿔주는 거임.
    // 리듀서는 새로운 거지만 그 안에 있는 함수는 바뀌면 안 됨
    case UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(
          (item) => (item.id === action.payload.id ? action.payload : item)
          // payload가 수정된 거
        ),
        error: null,
      };
    case DELETE_ITEM:
    case SET_ERROR:
      return { ...state, error: action.payload };
      dafault: return state;
  }
}

// Actions(실제 reducer가 state를 변경하기 전에 수행해야 하 작업들)
export const fetchItems = async (collectionName, queryOptions, dispatch) => {
  const resultData = await getDatas(collectionName, queryOptions);
  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "FETCH DATAS 에러!!!" });
  } else {
    dispatch({ type: FETCH_ITEMS, payload: resultData });
  }
};
export const additem = async (collectionName, addObj, dispatch) => {
  //  dispatch 할 변경된 state 값을 만들어야 한다.
  // 여기서 하려고 하는 게 아이템 추가
  const resultData = await addDatas(collectionName, addObj);
  // 여기서 resultData가 나온다는 것은 새로 추가된 문서객체가 들어있을 거임
  // 원래라면 resultData를 데리고 setState 써서 사용했을 거임
  // setState(prevItems => [...prevItems, resultData]);

  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "ADD Datas 에러!!!" });
  }

  //   dispatch 실행 시 reducer 함수로 간다.
  dispatch({ type: ADD_ITEM, payload: resultData });
};
export const updateItem = async (
  collectionName,
  docId,
  updateObj,
  dispatch
) => {
  const resultData = await updateDatas(collectionName, docId, updateObj);
  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "ADD Datas 에러!!!" });
  }

  //   dispatch 실행 시 reducer 함수로 간다.
  dispatch({ type: UPDATE_ITEM, payload: resultData });
};
export const deleteItem = async () => {};
