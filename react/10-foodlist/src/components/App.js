import "./App.css";
import backgroundImg from "../assets/background.png";
import logoImg from "../assets/logo.png";
import logoTextImg from "../assets/logo-text.png";
import FoodForm from "./FoodForm";
import { useEffect, useState } from "react";
import FoodList from "./FoodList";
import searchImg from "../assets/ic-search.png";
import { getDatasOrderByLimit } from "../api/firebase";

function AppSortButton({ children, selected, onClick }) {
  return (
    <button
      className={`AppSortButton ${selected ? "selected" : ""}`}
      onclick={onClick}
    >
      {/* 삼환 연산자 */}
      {children}
    </button>
    // children을 받아서 써준다.
  );
}
const LIMIT = 5;

function App(option) {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("food", options);
  // order: 정렬 순서
  const [lq, setLq] = useState();
  // lq: 마지막 쿼리(페이징 처리에 사용)
  const [hasNext, setHasNext] = useState(true);
  // hasNext: 더 가져올 데이터가 있는지 여부

  const handleLoad = async (options) => {
    const { resultData, lastQuery } = await getDatasOrderByLimit(
      "food",
      options
    );
    setItems((prevItems) => [prevItems]);
    // 배열 안에 배열을 넣은 형태, 이걸 풀어보고 싶어서 스프레드 연산자 사용하는 것
    setLq(lastQuery);
  };
  const handleLoadMore = async () => {};

  const handleNewestClick = () => setOrder("createdAt");
  const handleCalorieClick = () => setOrder("calorie");

  useEffect(() => {
    handleLoad({ fieldName: order, limits: LIMITS });
  }, [order]);

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="App-nav">
        <img src={logoImg} />
      </div>
      <div className="App-container">
        <div className="App-FoodForm">
          <FoodForm />
        </div>
        <div className="App-filter">
          <form className="App-search">
            <input className="App-search-input" />
            <button className="App-search-button">
              <img src={searchImg} />
            </button>
          </form>
          <div className="App-orders">
            <AppSortButton selected={order === "createdAt"}>
              최신순
            </AppSortButton>
            <AppSortButton selected={order === "calorie"}>
              칼로리순
            </AppSortButton>
          </div>
        </div>
        <FoodList
          items={items}
          // handleDelete={handleDelete}
          // onUpdate={updateDatas}
          // onUpdateSuccess={handleUpdateSuccess}
        />
        <button className="App-load-more-button" onClick={handleLoadMore}>
          더 보기
        </button>
      </div>
      <div className="App-footer">
        <div className="App-footer-container">
          <img src={logoTextImg} />
          <select>
            <option>한국어</option>
            <option>English</option>
          </select>
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
