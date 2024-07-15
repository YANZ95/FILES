import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import styles from "./Home.module.css";
import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";

function Home(props) {
  const [themeMode, toggleTheme] = useTheme();
  return (
    <div>
      <Nav className={styles.Nav} />
      <div className={styles.body}>
        <Outlet />
      </div>
      {/* 헤더하고 풋터가 바디 안 쪽으로 간다. 헤더하고 풋터는 동일하고
      그 중간 내용만 달라지게 만들거임 */}
      <ThemeToggleButton mode={themeMode} onClick={toggleTheme} />
      {/* prop in the component 뎀토글버튼에 함수로 들어감 */}
    </div>
  );
}

export default Home;
