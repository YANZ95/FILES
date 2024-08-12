import React from "react"; // React 라이브러리를 가져와 컴포넌트를 작성합니다.
import styles from "./CartItem.module.scss"; // CSS 모듈을 가져와 컴포넌트 스타일링에 사용합니다.
import { AiOutlineDelete } from "react-icons/ai"; // react-icons 라이브러리에서 삭제 아이콘을 가져옵니다.
import { Link } from "react-router-dom"; // 페이지 간의 링크를 제공하기 위해 react-router-dom에서 Link 컴포넌트를 가져옵니다.

function CartItem({ image, title, price, category, quantity, total }) {
  // CartItem 컴포넌트는 props로 전달된 상품 정보를 받아와 화면에 표시합니다.
  return (
    <div className={styles.cart_item}>
      {/* 스타일링을 위해 CSS 클래스를 div에 적용합니다. */}
      <Link>
        {/* 상품 이미지 클릭 시 상품의 세부 페이지로 이동할 수 있도록 Link 컴포넌트를 사용합니다. */}
        <img src={image} /> 
        {/* 상품 이미지를 화면에 표시합니다. */}
      </Link>
      <div className={styles.cart_description}>
        {/* 상품 설명을 위한 스타일링을 적용한 div입니다. */}
        <h3>{category}</h3> 
        {/* 상품의 카테고리를 표시합니다. */}
        <h2>{title}</h2> 
        {/* 상품의 제목을 표시합니다. */}
        <span>
          {price} x {quantity} = $ {total.toFixed(2)}
          {/* 가로에 숫자만큼 숫자가 고정된다. ex)52.6845 => 52.68 */}
          {/* 상품의 가격, 수량, 총합을 계산하여 표시합니다. */}
        </span>
      </div>
      <button className={styles.cart_delete}>
        {/* 삭제 버튼 스타일링을 적용합니다. */}
        <AiOutlineDelete />
        {/* 삭제 아이콘을 버튼에 표시합니다. */}
      </button>
      <div className={styles.cart_count}>
        {/* 상품 수량 조절을 위한 스타일링을 적용한 div입니다. */}
        <div>
          <button>-</button>
          {/* 수량 감소 버튼입니다. */}
          <span>1</span>
          {/* 현재 수량을 표시합니다. */}
          <button>+</button>
          {/* 수량 증가 버튼입니다. */}
        </div>
      </div>
    </div>
  );
}

export default CartItem; // 이 컴포넌트를 다른 곳에서 사용할 수 있도록 내보냅니다.

// CartItem 컴포넌트는 마치 쇼핑 카트의 하나의 칸에 해당하는 것과 같습니다.
// 이 칸에는 각 상품의 이미지, 정보, 수량, 삭제 버튼이 포함되어 있습니다.
// CartList와의 관계에서, CartList는 여러 개의 CartItem을 모아 전체 쇼핑 카트를 보여줍니다.
// CartItem은 각 상품에 대한 세부 정보를 보여주는 작은 카드 같은 역할을 하며, CartList는 이러한 카드를 배열하여 전체 목록을 구성합니다.
