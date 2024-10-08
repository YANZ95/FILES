import "./App.css";
import logo from "./assets/logo.png";
import blueOne from "./assets/dice-blue-1.svg";
import redOne from "./assets/dice-red-1.svg";
import Board from "./Board";
import { useState } from "react";
// 함수형 컴포넌트 : 컴포넌트를 함수형으로 만든 것 (변수형으로도 만들 수 있다.)
//  함수형 컴포넌트를 만들 때에는 함수명의 첫 글자는 반드시 대문자여야 한다.
// 함수형 컴포넌트 안에서는 JSX 문법으로 만든 리액트 엘리먼트를 리턴해줘야 한다.

// const style = {
//   backgroundColor: "#d9d9d9",
//   color: "yellow",
// };

//  for ==> htmlFor, onclick/onblur ==> onClick/onBlur

function random(n) {
  return Math.ceil(Math.random() * n);
}

function App() {
  // state
  // 던지기 버튼을 누르면 화면에서 주사위 이미지가  바뀌어야 한다.
  //  순수 자바스크립트로 작성한다면 주사위 이미지마다 화면을 만들거나, 비동기로 화면에 요소를 추가, 삭제하는 코드를 작성해야 한다.
  // 리액트 에서는 state라는 것을 사용한다.
  // 이 state가 바뀔 때마다 리액트가 알아서 화면을 새로 렌더링 해준다.
  const [myNum, setMYNum] = useState(1);
  const [otherNum, setOtherNum] = useState(1);
  const [gameHistory, setGameHistory] = useState([]);
  const [othergameHistory, setOtherGameHistory] = useState([]);
  console.log(gameHistory);
  console.log(othergameHistory);
  const handleRollClick = () => {
    // 주사위 숫자 뽑아야한다.
    const nextMyNum = random(6);
    const nextOtherNum = random(6);

    // 기록 추가 한다.
    setGameHistory([...gameHistory, nextMyNum]);
    setOtherGameHistory([...othergameHistory, nextOtherNum]);
  };

  const handleClearClick = () => {
    setGameHistory([]);
    setOtherGameHistory([]);
  };

  return (
    <div className="App">
      <div>
        <img src={logo} className="App-logo" />
        <h1 className="App-title">주사위게임</h1>
        <div>
          <button className="App-button blue" onClick={handleRollClick}>
            던지기
          </button>
          <button className="App-button red" onClick={handleClearClick}>
            처음부터
          </button>
        </div>
      </div>
      <div className="App-boards">
        <Board name="나" color="blue" gameHistory={gameHistory} />
        <Board name="상대" color="red" gameHistory={othergameHistory} />
      </div>
    </div>
  );
}

export default App;
