import React from "react";
import Avatar from "./Avatar";
import styles from "./Writer.module.css";
import cn from "classnames";

function Writer({ className, writer }) {
  const {
    name,
    level,
    profile: { photo },
  } = writer;
  // 중첩문 구조분해할 때 이렇게 씀
  return (
    <div className={cn(className, styles.writer)}>
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.level}>{level}</div>
      </div>
      <Avatar photoUrl={photo} />
    </div>
  );
}

export default Writer;
