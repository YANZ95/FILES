import React from "react";
import CategoryTab from "./category-tab/CategoryTab";
import styles from "./FiltersCategory.module.scss";
import { CategoriesName } from "../../../store/categories/categories";

function FiltersCategory() {
  return (
    <div className={styles.filter_category}>
      <CategoryTab text={"모두"} categoryName={CategoriesName.All} />
      <CategoryTab
        text={"전자기기"}
        categoryName={CategoriesName.Electronics}
      />
      <CategoryTab text={"쥬얼리"} categoryName={CategoriesName.Jewelry} />
      <CategoryTab
        text={"남성의류"}
        categoryName={CategoriesName.mensClothing}
      />
      <CategoryTab
        text={"여성의류"}
        categoryName={CategoriesName.womensClothing}
      />
    </div>
  );
}

export default FiltersCategory;
