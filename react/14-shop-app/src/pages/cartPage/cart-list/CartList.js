import React from "react"; // JSX 문법과 컴포넌트 기능을 사용하기 위해 React를 가져옵니다.
import { useDispatch, useSelector } from "react-redux"; // 상태 관리를 위해 React-Redux에서 훅을 가져옵니다.
import styles from "./CartList.module.scss"; // CSS 모듈을 가져와 컴포넌트 스타일링에 사용합니다.
import CartItem from "./cart-item/CartItem"; // 각 상품을 렌더링하기 위해 CartItem 컴포넌트를 가져옵니다.

function CartList() {
  const dispatch = useDispatch(); // Redux 스토어에 액션을 보낼 수 있는 dispatch 함수를 생성합니다.
  const { products } = useSelector((state) => state.cartSlice);
  // Redux 스토어의 cartSlice 상태에서 products를 추출하여 사용합니다.
  // 프로덕트 슬라이스 파일에서 가져온 게 아니라
  // 카트 슬라이스에서 가져온 거임.

  return (
    <div className={styles.cart_list}>
      {/* 스타일링을 위해 CSS 클래스를 div에 적용합니다. */}
      {products.map((product) => (
        <CartItem key={product.id} {...product} />
        // products 배열을 순회하면서 각 상품에 대해 CartItem 컴포넌트를 렌더링합니다.
        // 각 CartItem은 고유한 key와 상품 속성을 받습니다.
        // 이렇게 쓰면 return 앞에 사용 안 해도 됨
        // {return <NavCartItem item={product} /> };
      ))}
    </div>
  );
}

export default CartList; // 이 컴포넌트를 다른 곳에서 사용할 수 있도록 내보냅니다.

// 이 파일은 마치 전자 상거래 웹사이트의 쇼핑 카트 디스플레이와 같습니다.
// 사용자가 카트에 추가한 모든 항목을 수집하여 깔끔하게 보여줍니다. 마치 컨베이어 벨트에 놓인 상품들처럼요.
// CartList 컴포넌트는 이러한 상품들을 시각적인 리스트로 만들어 사용자가 구매하고자 하는 물건을 한눈에 볼 수 있게 해줍니다.
