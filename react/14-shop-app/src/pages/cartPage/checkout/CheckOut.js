import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./CheckOut.module.scss";
import { useDispatch, useSelector } from "react-redux";
import cartSlice, { getTotalPrice } from "./../../../store/cart/cartSlice";

function CheckOut() {
  const { totalPrice } = useSelector((state) => state.cartSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTotalPrice());
  }, []);
  return (
    <div className={styles.CheckOut}>
      <div>
        <p>
          <span>합계: $ {totalPrice.toFixed(2)}</span>
        </p>
        {/* <button className={styles.CheckOut_button}>계산하기</button> */}
        <Link className={styles.CheckOut_button}>로그인</Link>
      </div>
    </div>
  );
}

export default CheckOut;
