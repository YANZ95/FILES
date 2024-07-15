import React from "react";
import Container from "./Container";
// -> 함수형 컴포넌트
import { Link } from "react-router-dom";
import styles from "./Nav.module.css";
import cn from "classnames";
import { useTheme } from "../context/ThemeContext";

function Nav({ className }) {
  // Nav를 Home 에 추가
  const [themeMode] = useTheme();
  const menuClass = `{styles.menu} ${themeMode === "dark" ? styles.dark : ""}`;
  // {menuClass} 로 들어감

  return (
    <div className={styles.nav}>
      <Container className={styles.container}>
        <Link to="/">
          <div className={styles.logo}>
            <span>DW</span>
            OS
          </div>
        </Link>
        <ul className={menuClass}>
          <li>
            <Link to="about">ABOUT</Link>
          </li>
        </ul>
      </Container>
    </div>
  );
}

export default Nav;
