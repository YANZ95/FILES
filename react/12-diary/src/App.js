import React, { createContext, useEffect, useReducer } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewPage from "./pages/NewPage";
import { additem, fetchItems, initialState, reducer } from "./api/itemReducer";

// 2개 컨텍스트 설정
export const DiaryStateContext = createContext();
export const DiaryDisatchContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // (reducer, initialState)는 itemReducer에서 export해서 가져옴

  // create
  const onCreate = async (values) => {
    const addObj = {
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      date: new Date(values.date).getTime(),
      content: values.content,
      emotion: values.emotion,
      userEmail: "yjw1732@gmail.com",
    };
    await additem("diary", addObj, dispatch);
    // addObj - 사용자가 입력한 값을 가져온다.
  };

  // READ
  // UPDATE
  // DELETE

  useEffect(() => {
    fetchItems(
      "diary",
      {
        conditions: [
          { field: "userEmail", operator: "==", value: "yjw1732@gmail.com" },
        ],
        orderBys: [{ field: "date", direction: "desc" }],
      },
      dispatch
    );
  }, []);

  return (
    // 아래 2개 컨텍스트 범위 설정  DiaryStateContext, DiaryDisatchContext
    <DiaryStateContext.Provider value={state.items}>
      <DiaryDisatchContext.Provider value={{ onCreate }}>
        <BrowserRouter>
          {/* 여기서 위 2개의 벨류 안의 내용물을 사용함  */}
          <div className="App">
            <Routes>
              <Route path="/">
                <Route index element={<HomePage />} />
                <Route path="new" element={<NewPage />} />
                {/* <Route path='edit' element={} />
<Route path='diary' element={} /> */}
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDisatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
