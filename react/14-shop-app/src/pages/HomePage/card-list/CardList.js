import React from "react";
import styles from "./CardList.module.scss";

const products = [
  {
    id: 1,
    title: "가방",
    price: 109.95,
    description:
      "숲에서 하루종일 걷고 난리쳐도 좋은 가방. 15인치가 넘는 노트북도 들어감",
    category: "Men's clothing",
    image: "./아디다스 가방.jpg",
    rating: {
      rate: 3.9,
      count: 120,
    },
  },

  {
    id: 2,
    title: "남성의류",
    price: 50.32,
    description: "청색 남방으로 흰 색 등 밝은 계열 옷과 잘 어울린다.",
    category: "Men's clothing",
    image: "./청남방.jpg",
    rating: {
      rate: 5.1,
      count: 100,
    },
  },
];

function CardList() {
  // 위의 프로덕트가 이 안에 렌더링될 수 있도록 처리하기
  //  단 하나만 나와도 성공임
  return (
    <ul className={StyleSheet.care_list}>
      {products.map((product) => (
        <li key={product.id} className={styles.card}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.image}
          />
          <h2 className={styles.title}>{product.title}</h2>
          <p className={styles.price}>${product.price}</p>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.rating}>
            Rating: {product.rating.rate} ({product.rating.count} reviews)
          </p>
        </li>
      ))}
    </ul>
  );
}

export default CardList;
