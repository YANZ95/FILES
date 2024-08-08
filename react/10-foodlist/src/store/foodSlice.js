import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// 타입스크립트 만들 때 호환성이 좋아서 자동완성이 여기서는 잘 안 되는 상태임
import { getDatasOrderByLimit, updateDatas } from "../api/firebase";

const foodSlice = createSlice({
  name: "food",
  initialState: {
    items: [],

    lq: undefined,
    // usestate로 관리되고 있는 녀석을 넘길 거임
    isLoading: false,
    loadingError: "",
    order: "createdAt",
    hasNext: true,
  },
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setHasNext: (state, action) => {
      state.hasNext = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 빌더는 2개 이상은 가로 자동으로 쳐짐
    // 비동기작업은 .actionCreator 를 자동으로 만들어주지 못한다.
    // 그래서 아래에 임의로 만들어준 거임
    // 만들어줘야 될 애들은 addItem,
    // add delete 하고 추가하고 없어지는 것을 만든다면 패치를 한다면
    // 추가된 상태에서의 삭제, 삭제된 상태의 추가

    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        if (action.payload.isReset) {
          state.items = action.payload.resultData;
        } else {
          action.payload.resultData.forEach((data) => {
            state.items.push(data);
          });
          // state.items = [...state.items, ...action.payload.resultData];
        }
        // if(!action.payload.lastQuery) {
        //   state.hasNext = false;
        // }else {
        //   state.hasNext = true;
        // }
        // state.hasNext = action.payload.lastQuery ? true : false;
        state.hasNext = !!action.payload.lastQuery;
        state.lq = action.payload.lastQuery;
        state.isLoading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.loadingError = action.payload;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        // state.status = "fail";
        // ----------------------------------------------
        // state.items.map((item) => {
        //   item.id === action.payload.id ? action.paload : item;
        // });
        //  state.items.map => 바꾸려고 하는 녀석
        // 원본 냅두고 바꾸는 것, 웝본 냅두고 참조하는 것, 원본 냅두고 참조하고 반복하는 것
        // 23번째를 쓴다. 반복해서 참조하는 것이 맵함수다.
        // 필터 함수 쓰는 이유 -> 원하는 것을 뽑으려고
        // 원초적인 것은 인덱스만 찾으면 됨
        //state.items[index] = {} //-> 이 방법이 더 쉬운 방법이다.
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items[index] = action.payload;
        state.isLoading = false;
      });
  },
});

const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async ({ collectionName, queryOptions }) => {
    // 요런식으로 payload를 만드는 payload async를 넘겨줘야됨
    // 어싱크 안에 왜 하나로 인식되기 위해 객체를 넣는지?
    try {
      const resultData = await getDatasOrderByLimit(
        collectionName,
        queryOptions
      );
      resultData.isReset = !queryOptions.lastQuery ? true : false;
      // dispatchEvent({type: "FETCH_ITEM", payload: resultData});
      return resultData;
    } catch (error) {
      return "FETCH Error: " + error;
      // console.log("FETCH Error: ", error);
    }
  }
);
// 원래 비동기 함수 관리하는 게 굉장히 까다로운데 패치아이템 함수 쓰면 편해짐

const updateItem = createAsyncThunk(
  // 파라미터를 만들면 두번 째에 들어간다.
  // 함수의 로직 안에 비동기 함수가 들어있는 게 createAsyncThunk
  // 액션과 크레이이터를 디스패치라고 한다?
  "items/updateItem",
  async ({ collectionName, docId, updateObj, imgUrl }) => {
    try {
      const resultData = await updateDatas(
        // 요 함수가 끝나면 디스패치와 페이로드 안으로 들어간다.
        //  디스패치가 실행하면 들어가는 곳이 리듀서임
        collectionName,
        docId,
        updateObj,
        imgUrl
      );
      return resultData;
    } catch (error) {
      return "UPDATE Error: " + error;
    }
  }
);
// type, payload;
// dispatch({});
// => 아이템리듀서에서 이렇게 씀
// 페이로드 => 디스패치에 전달
// createAsyncThunk가 알아서 요 모양을 만들어준다. => (type, payload)
// 비동기 로직을 처리 => createAsyncThunk

export default foodSlice;
export { fetchItems, updateItem };
export const { setOrder, setHasNext } = foodSlice.actions;
