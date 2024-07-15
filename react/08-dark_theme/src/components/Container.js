import styles from "./Container.module.css";
import cn from "classnames";

function Container({ className, children }) {
  //  const childeren = props.children
  return (
    <div className={cn(styles.container, className)}>
      {children}
      {/*  {children}은 리액트에서 알아서 전달해주는 prov임. 그래서
            이름 바꿀 수 없음. 중괄호 안 쓰면 prov 객체가 되는 녀석임.
            중괄호 안 쓰면 안에 쓰는 props 역할을 하게 된다. 안에 중괄호
            써서 받는 형식으로 쓴다.*/}
    </div>
  );
}

export default Container;
