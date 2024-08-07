import "./App.css";
import backgroundImg from "../assets/background.png";
import logoImg from "../assets/logo.png";
import logoTextImg from "../assets/logo-text.png";
import FoodForm from "./FoodForm";
import searchImg from "../assets/ic-search.png";
import FoodList from "./FoodList";
import { useEffect, useState } from "react";
import {
  addDatas,
  deleteDatas,
  getDatasOrderByLimit,
  getSearchDatas,
  updateDatas,
} from "../api/firebase";
import { updateMetadata } from "firebase/storage";
import LocaleSelect from "./LocaleSelect";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems, setOrder } from "../store/foodSlice";
import useAsync from "../hooks/useAsync";

function AppSortButton({ children, selected, onClick }) {
  return (
    <button
      className={`AppSortButton ${selected ? "selected" : ""}`}
      onClick={onClick}
      disabled={selected}
    >
      {/* 삼환 연산자 */}
      {children}
    </button>
    // children을 받아서 써준다.
  );
}

const LIMITS = 5;

function App() {
  const dispatch = useDispatch();
  const { items, order, lq, hasNext, isLoading } = useSelector(
    (state) => state.food
  );
  // const [items, setItems] = useState([]);
  // const [order, setOrder] = useState("createdAt");
  // const [order, setOrder] = useState("food", options);
  // order: 정렬 순서
  // const [lq, setLq] = useState();
  // lq: 마지막 쿼리(페이징 처리에 사용)
  // const [hasNext, setHasNext] = useState(true);
  const [search, setSearch] = useState("");
  // hasNext: 더 가져올 데이터가 있는지 여부
  // const [isLoading, loadingError, getDatasAsync] =
  //   useAsync(getDatasOrderByLimit);

  const handleLoad = async (options) => {
    dispatch(fetchItems({ collectionName: "food", queryOptions: options }));

    // // setIsLoading(true);
    // const { resultData, lastQuery } = await getDatasOrderByLimit(
    //   "food",
    //   options
    // );
    //   if (!options.lq) {
    //     // setItems(resultData);
    //   } else {
    //     // setItems((prevItems) => [...prevItems, ...resultData]);
    //     // 배열 안에 배열을 넣은 형태, 이걸 풀어보고 싶어서 스프레드 연산자 사용하는 것
    //   }
    //   setLq(lastQuery);
    //   if (!lastQuery) {
    //     setHasNext(false);
    //   }
  };
  const handleLoadMore = async () => {
    const queryOptions = {
      conditions: [],
      orderBys: [{ field: order, direction: "desc" }],
      lastQuery: lq,
      limits: LIMITS,
    };
    handleLoad(queryOptions);
    // handleLoad({ fieldName: order, limits: LIMITS, lq: lq });
  };

  const handleNewestClick = () => dispatch(setOrder("createdAt"));
  const handleCalorieClick = () => dispatch(setOrder("calorie"));

  // const handleNewestClick = () => setOrder("createdAt");
  // const handleCalorieClick = () => setOrder("calorie");

  const handleDelete = async (docId, imgUrl) => {
    // imgUrl을 하나 더 받겠다.  firebase에 연결할거라서 async 사용

    // items 에서 docId 를 받아온다.

    // db에서 데이터 삭제(스토리지에 있는 사진파일 (imgUrl) 삭제, database에 있는 데이터 삭제)
    const { result, message } = await deleteDatas("food", docId, imgUrl);

    if (!result) {
      alert(MessageChannel);
      return;
    }
    //삭제 성공시 화면에 그 결과를 반영한다.
    // setItems((prevItems) =>
    // prevItems. 15개 담긴 배열. 현재 state 값.  {...,docId}, {...,docId}... -> 15개
    //   prevItems.filter(function (item) {
    //     return item.docId !== docId;
    //     // 삭제된 녀석만 삭제된 배열에 넣겠다는 말
    //     // === => !== 같다가 아니라 다르다로 만듬
    //   })
    // );
  };

  const handleAddSuccess = (resultData) => {
    const queryOptions = {
      conditions: [],
    };
    handleLoad(queryOptions);
    // setItems((prevItems) => [resultData, ...prevItems]);
  };

  const handleUpdateSuccess = (result) => {
    console.log(result);
    // setItems((prevItems) => {
    // 수정된 item의 index 찾기
    //   const splitIdx = prevItems.findIndex(function (item) {
    //     return item.id === result.id;
    //   });
    //   const beforeArr = prevItems.slice(0, splitIdx);
    //   const afterArr = prevItems.slice(splitIdx + 1);
    //   return [...beforeArr, result, ...afterArr];
    //   // return [
    //   //   ...prevItems.slice(0, splitIdx),
    //   //   result,
    //   //   ...prevItems.slice(splitIdx + 1)
    //   // ]
    // });
  };

  //   useEffect(() => {
  //     // handleLoad({ fieldName: order, limits: LIMITS, lq: undefined });
  //   }, [order]
  // );
  useEffect(() => {
    // handleLoad({ fieldName: order, limits: LIMITS, lq: undefined });
    const queryOptions = {
      conditions: [],
      orderBys: [{ field: order, direction: "desc" }],
      lastQuery: undefined,
      limits: LIMITS,
    };
    // const collectionName = "food";
    // dispatch(fetchItems({ collectionName: "food", queryOptions }));
    handleLoad(queryOptions);
  }, [order]);

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="App-nav">
        <img src={logoImg} />
      </div>
      <div className="App-container">
        <div className="App-FoodForm">
          <FoodForm onSubmit={addDatas} onSubmitSuccess={handleAddSuccess} />
          {/* 여기에 있는 푸드리스트 아이템에 들어있는 푸드폼 이건 무엇인가? */}
          {/* 수정할 때 나오는 녀석, 이때는  */}
        </div>
        <div className="App-filter">
          <form className="App-search">
            <input className="App-search-input" />
            <button className="App-search-button">
              <img src={searchImg} />
            </button>
          </form>
          <div className="App-orders">
            <AppSortButton
              selected={order === "createdAt"}
              onClick={handleNewestClick}
            >
              최신순
            </AppSortButton>
            <AppSortButton
              selected={order === "calorie"}
              onClick={handleCalorieClick}
            >
              칼로리순
            </AppSortButton>
          </div>
        </div>
        <FoodList
          items={items}
          onDelete={handleDelete}
          // onUpdate={updateData}
          onUpdate={handleUpdate}
          onUpdateSuccess={handleUpdateSuccess}
        />
        {/* 수정후 처리  */}

        {hasNext && (
          <button className="App-load-more-button" onClick={handleLoadMore}>
            더 보기
          </button>
        )}
      </div>
      <div className="App-footer">
        <div className="App-footer-container">
          <img src={logoTextImg} />
          <LocaleSelect />
          <div className="App-footer-menu">
            서비스 이용약관 | 개인정보 처리방침
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

{
  /* // import "./App.css";
// import FoodForm from "./components/FoodForm"
// import FoodList from "./components/FoodList"
// import FoodForm from "./components/Food"
// import FoodForm from "./components/FoodForm"
// import logoImg from "./assets/l"
import LocaleSelect from './LocaleSelect';

// const LIMIT = 5;

// function App() { */
}
{
  /* //   return (
//     <div className="App">
//       <nav className="App-nav">
//         <div className="App-nav-container">
//           <img className="App-logo" src={logoImg} />

//         </div>
//       </nav>
//       <div className="App-container">
//         <div className="App-FoodForm">
//           <FoodForm
//             onSubmit={addDatas}
//             handleSubmitSuccess={handleSubmitSuccess}
//           />
//         </div>
//         <div className="App-sorts">
//           <AppSortButton
//             selected={order === "createdAt"}
//             onclick={handleNewsClick}
//           >
//             최신순
//           </AppSortButton>
//           <AppSortButton
//             selected={order === "calorie"}
//             onclick={handleCalClick}
//           >
//             칼로리순
//           </AppSortButton>
//         </div>
//         <div className="App-FoodList">
//           <FoodList />
//           <button
//             className="App-load-more-button"
//             onclick={handleMoreClick}
//             disabled={!hasNext}
//           >
//             더보기
//           </button>
//         </div>
//         <footer className="App-footer">
//           <div className="App-footer-container">| 개인정보 처리방침</div>
//         </footer>
//       </div>
//     </div>
//   );
// }

// export default App; */
}
