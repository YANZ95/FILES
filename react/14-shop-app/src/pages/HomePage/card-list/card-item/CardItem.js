import React from "react";
import { Link } from "react-router-dom";
import styles from "./CardItem.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem, addToCart } from '../../../../store/cart/cartSlice';

function CardItem({ item }) {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.cartSlice);
  const productMatching = products.some((product) => product.id === item.id);
  const { uid, isAuthenticated } = useSelector((state) => state.userSlice);
  // const productMatching = products.some((product) => {
  //   dispatch(addToCart(item));
    // product.id === item.id;
  // });
  // 파인드는 같은 놈 찾아주는 역할을 한다.
  // 이 함수를 이용해 들어있는 지 없는 지 확인을 한다.
  // 어떤 방법으로 확인을 하는냐 => 프로덕츠는 배열, 배열 안
  // 에는 카트 아이템이 들어있고 거기에는 아이템과 카트아이템에서
  // 넘어온 아이디를 이용해 비교해서 걷어내면 됨. 그 방법이 뭐냐?
  // 인덱스 함수를 이용한다.
  const addItemToCart = () => {
    if (isAuthenticated) {
    // 저 아이템이 카트에 들어있는 지 확인하는 방법
    // 카트를 가져와서 카트아이템 함수에 들어있는 아이템과 비교해야
    // 한다. 카트슬라이스에 있는 녀석과 같냐
    dispatch(
 // addCartItem({ collectionName: ['users', uid, 'cart'], product: item })
    // localStorage;

    addCartItem({
      collectionName: `/users/${uid}/cart/${item.id}`,
      product: item,
    })
  );
} else {
  dispatch(addToCart(item));
}
};


  return (
    <li className={styles.card_item}>
      <Link to={`/product/${item.docid}`}>
        <img src={item.image} />
        {/* 이미지 크기 */}
      </Link>
      <h5>{`${item.title.slice(0, 15)}...`}</h5>
      <div>
        <button disabled={productMatching} onClick={addItemToCart}>
          {productMatching ? "장바구니에 담긴 제품" : "장바구니에 담기"}
        </button>
        <p>$ {item.price}</p>
      </div>
    </li>
  );
}

export default CardItem;
