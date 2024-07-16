import styles from "./Container.module.css";
import cn from "classnames";

function Container({ className, children }) {
  // 컨테이너 함수 선언
  return (
    <div className={cn(styles.container, className)}>{children}</div>
    // {children}가 어떤 걸 뜻하는 걸까? 왜 안눌릴까
  );
}

export default Container;
