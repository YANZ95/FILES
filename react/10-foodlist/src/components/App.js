import "./App.css";
import backgroundImg from "../assets/background.png";
import logoImg from "../assets/logo.png";
import logoTextImg from "../assets/logo-text.png";
import FoodForm from "./FoodForm";
import { useState } from "react";

function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="App-nav">
        <img src={logoImg} />
      </div>
      <div className="App-container">
        <div className="App-FoodForm">
          <FoodForm />
        </div>
        <div></div>
        {/* <FoodList /> */}
        <button>더 보기</button>
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

// import "./App.css";
// import FoodForm from "./components/FoodForm"
// import FoodList from "./components/FoodList"
// import FoodForm from "./components/Food"
// import FoodForm from "./components/FoodForm"
// import logoImg from "./assets/l"

// const LIMIT = 5;

// function App() {
//   return (
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

// export default App;
