import React from "react";
import styles from "./Button.module.css";

function Button({ children }) {
  return <button className={styles.button} children={children} />;
  //   반환해주는 button className은 Button 함수의 자식이기 때문에
  // 반드시 소문자로 써줘야 된다.
}

export default Button;
