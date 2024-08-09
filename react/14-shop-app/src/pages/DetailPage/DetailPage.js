import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import styles from "./DetailPage.module.scss";
import productSlice, {
  fetchProduct,
} from "./../../store/products/productSlice";
import { collection } from "firebase/firestore";

function DetailPage() {
  // 여러 개의 프로덕츠 중에서 아이디 이용해서 꺼내올 수 있게 만들어보기
  //   dwos coursePage 참고해서 만들어보기
  //   아이디를 어디에서 가져오지?
  // 패치 프로덕트 가져와야 되는데 연결해줄만한 걸 연결해줘야됨

  const { id } = useParams();
  //   주소열이 모두 문자라서 아이디는 문자가 된다.
  // 파이어베이스 페이지에서의 아이디는 숫자라서 ""가 없어서 못 찾아줌
  // 그래서 숫자 -> 문자로 만들어줘야됨
  const productId = Number(id);
  const dispatch = useDispatch();
  useDispatch((state) => state.productSlice);
  const { product, isLoading } = useSelector((state) => state.productSlice);

  useEffect(() => {
    const queryOptions = {
      conditions: [{ field: "id", operator: "==", value: productId }],
    };
    dispatch(fetchProduct({ collectionName: "products", queryOptions }));
  }, []);

  return (
    <div className="page">
      {isLoading ? (
        "Loading..."
      ) : (
        //조건부 렌더링, 뒷쪽 가로에 쓴 거 집어넣음
        <div className={styles.card_wrapper}>
          <div className={styles.card_img}>
            <img src={product.image} />
          </div>
          <div className={styles.card_description}>
            <h3>{product.category}</h3>
            <h1>{product.title}</h1>
            <h4>{product.price}</h4>
            <p>{product.description}</p>
            <div>
              <button>장바구니에 담기</button>
              <Link>장바구니로 이동</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailPage;
