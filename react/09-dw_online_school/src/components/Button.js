import React from "react";
import styles from "./Button.module.css";
import cn from "classnames";

function Button({ variant, ...restProps }) {
  return (
    <button
      {...restProps}
      className={cn(styles.button, variant && styles[variant])}
    />
    //  <button>
    //   {...restProps}
    //  </button>
  );
}

// function Button({ children, variant }) {
//   return <button className={cs({variant, ...restProps} ) } children={children} />;

//   //   반환해주는 button className은 Button 함수의 자식이기 때문에
//   // 반드시 소문자로 써줘야 된다.
//   // cs(styles.button), 콤마 찍어 여러개 가능
// }

export default Button;
