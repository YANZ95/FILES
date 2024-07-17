import React from "react";
import styles from "./Card.module.css";
import cn from "classnames";

function Card({ className, children }) {
  // 클래스네임과 칠드런을  받아준다.
  return <div className={cn(styles.card, className)}>{children}</div>;
  // 클래스네임이 들어오면 그 클래스네임이 맞춰서 적용한다.
  // 스타일컴포넌트를 만들고 프롭을 받아서 적는거
  // 기본 스타일 컴포넌트를 받아서 그 컴포넌트에서 적는다.
  // 스타일 컴포넌트를 만들 때는 모듈을 받아서 쓸 수도 있다.
}

export default Card;
