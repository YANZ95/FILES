import React, { createContext, useEffect, useReducer } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewPage from "./pages/NewPage";
import {
  additem,
  deleteItem,
  fetchItems,
  initialState,
  reducer,
  updateItem,
} from "./api/itemReducer";
import DiaryPage from "./pages/DiaryPage";
import EditPage from "./pages/EditPage";
import Button from "./components/Button";
import LoginPage from "./pages/LoginPage";
import { getUserAuth } from "./api/firebase";
import { userinitialState, userReducer } from "./api/userReducer";
import { useAuthState } from "react-firebase-hooks/auth";

// 2개 컨텍스트 설정
export const DiaryStateContext = createContext();
export const DiaryDisatchContext = createContext();

function App() {
  // const [state, dispatch] = useReducer(reducer, initialState);
  // [state, dispatch]
  // (reducer, initialState)는 itemReducer에서 export해서 가져옴
  // const navigate = useNavigate();
  const items = useSelector((state) => state.diary.items);
  const dispatch = useDispatch();

  const [userState, loginDispatch] = useReducer(userReducer, userinitialState);
  const auth = getUserAuth();
  const [user] = useAuthState(auth);

  // const goLogin = () => {
  //   navigate("/login");
  // };

  // create
  const onCreate = async (values) => {
    const addObj = {
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      date: new Date(values.date).getTime(),
      content: values.content,
      emotion: values.emotion,
      userEmail: user.email,
    };
    await additem("diary", addObj, dispatch);
    // addObj - 사용자가 입력한 값을 가져온다.
  };

  // READ
  // UPDATE
  const onUpdate = async (values, docId) => {
    const updateObj = {
      updatedAt: new Date().getTime(),
      date: new Date(values.date).getTime(),
      content: values.content,
      emotion: values.emotion,
    };
    await updateItem("diary", values.docId, updateObj, dispatch);
  };
  // DELETE
  const onDelete = async (docId) => {
    await deleteItem("diary", docId, dispatch);
  };

  useEffect(() => {
    //   fetchItems(
    //     "diary",
    //     {
    //       conditions: [
    //         {
    //           field: "userEmail",
    //           operator: "==",
    //           value: user ? user.email : "admin@gmail.com",
    //         },
    //         // 로그인한 사용자의 계정이 들어가야됨, 그 이메일이 있다면 여기에 넣어주면
    //         // 그 사람이 작성한 게시물만 가져와짐
    //       ],
    //       orderBys: [{ field: "date", direction: "desc" }],
    //     },
    //     dispatch
    //   );
    dispatch(
      fetchItems({
        collectionName: "diary",
        queryOptions: {
          conditions: [
            {
              field: "userEmail",
              operator: "==",
              value: user ? user.email : "admin@gmail.com",
            },
          ],
          orderBys: [{ field: "date", direction: "desc" }],
        },
      })
    );
  }, [user]);

  return (
    // 아래 2개 컨텍스트 범위 설정  DiaryStateContext, DiaryDisatchContext
    <DiaryStateContext.Provider value={{ diaryList: items, auth }}>
      {/* auth: userState */}
      <DiaryDisatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
        <BrowserRouter>
          {/* 여기서 위 2개의 벨류 안의 내용물을 사용함  */}
          <div className="App">
            {/* <Button text={"로그인"} className="btn_login" /> */}
            {/* 네비게이션을 라우트 안 쪽에 써야 되는데 안 쪽에 쓸 수 없어서 다른 방법으로 바꿈 */}
            <Routes>
              <Route path="/">
                <Route index element={<HomePage />} />
                <Route path="new" element={<NewPage />} />
                <Route path="edit/:id" element={<EditPage />} />
                <Route path="diary/:id" element={<DiaryPage />} />
                <Route path="login" element={<LoginPage />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDisatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
