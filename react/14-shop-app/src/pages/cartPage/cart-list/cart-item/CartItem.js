import React from "react";
import styles from "./CartItem.module.scss";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";

function CartItem({ image, title, price, category, quantity, total }) {
  return (
    <div className={styles.cart_item}>
      <Link>
        <img src={image} />
      </Link>
      <div className={styles.cart_description}>
        <h3>{category}</h3>
        <h2>{title}</h2>
        <span>
          {price} x {quantity} = $ {total.toFixed(2)}
          {/* 가로에 숫자만큼 숫자가 고정된다.  */}
        </span>
      </div>
      <button className={styles.cart_delete}>
        <AiOutlineDelete />
      </button>
      <div className={styles.cart_count}>
        <div>
          <button>-</button>
          <span>1</span>
          <button>+</button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
