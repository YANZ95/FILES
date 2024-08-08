import React from "react";
import styles from "./CategoryTab.module.scss";

function CategoryTab({ text, categoryName }) {
  const category = "";
  // 이 변수는 나중에 슬라이스에서 가져온 상태가 될 거 임
  return (
    <button
      className={
        categoryName === category
          ? styles.active_category
          : styles.category_button
      }
    >
      {text}
    </button>
  );
}

export default CategoryTab;
