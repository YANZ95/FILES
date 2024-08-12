import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./CartList.module.scss";
import CartItem from "./cart-item/CartItem";

function CartList() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.cartSlice);
  // 프로덕트 슬라이스 파일에서 가져온 게 아니라
  // 카트 슬라이스에서 가져온 거임.

  return (
    <div className={styles.cart_list}>
      {products.map((product) => (
        <CartItem key={product.id} {...product} />
        //  이렇게 쓰면 return 앞에 사용 안 해도 됨
        // {return <NavCartItem item={product} /> };
      ))}
    </div>
  );
}

export default CartList;
