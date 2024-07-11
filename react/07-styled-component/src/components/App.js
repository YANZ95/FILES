import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      {/* return  안에는 무조건 div 하나는 있어야 됨 */}
      <h1>Hello, Styled Component!!</h1>
      <ul>
        <Link to="01">
          {/* 누르면 해당 번호 폴더로 연결됨  */}
          <li>1. Styled Component Basic</li>
        </Link>
        <Link to="02">
          <li>2. Nesting 문법</li>
        </Link>
        <Link to="03">
          <li>3. 연습1</li>
        </Link>
        {/* <Link to="04">
          <li>4. 연습2</li>
        </Link> */}
      </ul>
      <Outlet />
    </>
  );
}

export default App;
