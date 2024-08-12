import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import styles from "./NavCartItem.module.scss";

function NavCartItem({ image, title, price, category, quantity, total }) {
  return (
    <div className={styles.nav_cart_item}>
      <Link>
        <img src="/아디다스 가방.png" />
      </Link>
      <div className={styles.nav_cart_description}>
        <h3>{category}</h3>
        <h2>{title}</h2>
        <span>
          {price} x {quantity} = $ {total.toFixed(2)}
          {/* 가로에 숫자만큼 숫자가 고정된다.  */}
        </span>
      </div>
      <button className={styles.nav_cart_delete}>
        <AiOutlineDelete />
      </button>
    </div>
  );
}

export default NavCartItem;
