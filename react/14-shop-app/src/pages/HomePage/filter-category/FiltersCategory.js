import React from "react";
import CategoryTab from "./category-tab/CategoryTab";
import { CategoriesName } from "../../store/categories/categories";
import Styles from "./FiltersCategory.module.scss";

function FiltersCategory() {
  return (
    <div className={Styles.filter_category}>
      <CategoryTab text={"모두"} categoryName={CategoriesName.All} />
      <CategoryTab
        text={"전자기기"}
        categoryName={CategoriesName.Electronics}
      />
      <CategoryTab text={"쥬얼리"} categoryName={CategoriesName.Jewerly} />
      <CategoryTab
        text={"남성의류"}
        categoryName={CategoriesName.MensCloathing}
      />
      <CategoryTab
        text={"여성의류"}
        categoryName={CategoriesName.WomensClothing}
      />
    </div>
  );
}

export default FiltersCategory;
