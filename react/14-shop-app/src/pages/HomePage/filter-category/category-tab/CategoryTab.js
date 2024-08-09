import React from "react";
import styles from "./CategoryTab.module.scss";
import { useDispatch, useSelector } from "react-redux";
import categoriesSlice, {
  setActiveCategory,
} from "../../../../store/categories/categoriesSlice";

function CategoryTab({ text, categoryName }) {
  // const category = "";
  // 이 변수는 나중에 슬라이스에서 가져온 상태가 될 거 임
  const dispatch = useDispatch();
  // 리턴 아래에서 디스패치 이용하려고 여기에 디스패치 선언을 하는 거임
  const category = useSelector((state) => state.categoriesSlice);
  return (
    <button
      className={
        categoryName === category
          ? styles.active_category
          : styles.category_button
      }
      onClick={() => dispatch(setActiveCategory(categoryName))}
    >
      {text}
    </button>
  );
}

export default CategoryTab;
