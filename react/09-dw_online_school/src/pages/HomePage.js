import React from "react";
import container from "../components/Container";
import landing from "../assets/landing.svg";
import styles from "./HomePage.module.css";
import Button from "../components/Button";

function HomePage(props) {
  return (
    <div className={styles.bg}>
      <container className={styles.container}>
        <div className={styles.texts}>
          <h1 className={styles.heading}>
            <span>코딩이 처음이라면,</span>
            <br />
            <strong>DWOS</strong>
          </h1>
          <p className={styles.description}>
            11만 명이 넘는 비전공자, 코딩 입문자가 DWOS 무제한 멤버십을
            선택했어요.
            <br />
            지금 함께 시작해보실래요?
          </p>
          <div>
            {/* div 감싸야 버튼이 작아짐 */}
            {/* 왜 감싸야 작아질까? */}
            <Button>지금 시작하기</Button>
          </div>
        </div>
        <div className={styles.figure}>
          <img src={landing} />
        </div>
      </container>
    </div>
  );
}

export default HomePage;
