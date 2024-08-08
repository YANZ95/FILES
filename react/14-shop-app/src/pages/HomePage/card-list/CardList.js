import React, { useEffect } from "react";
import styles from "./CardList.module.scss";
import CardItem from "./card-item/CardItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../store/products/productsSlice";

// const products = [
//   {
//     id: 1,
//     title: "가방",
//     price: 109.95,
//     description:
//       "숲에서 하루종일 걷고 난리쳐도 좋은 가방. 15인치가 넘는 노트북도 들어감",
//     category: "Men's clothing",
//     image: "/아디다스 가방.jpg",
//     rating: {
//       rate: 3.9,
//       count: 120,
//     },
//   },

//   {
//     id: 2,
//     title: "남성의류",
//     price: 50.32,
//     description: "청색 남방으로 흰 색 등 밝은 계열 옷과 잘 어울린다.",
//     category: "Men's clothing",
//     image: "/청남방.jpg",
//     rating: {
//       rate: 5.1,
//       count: 100,
//     },
//   },
// ];

function CardList(product) {
  // 위의 프로덕트가 이 안에 렌더링될 수 있도록 처리하기
  //  단 하나만 나와도 성공임
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productsSlice);
  const category = "";
  useEffect(() => {
    const queryOptions = {
      conditions: [
        {
          field: "category",
          operator: category ? "==" : ">=",
          value: category.toLowerCase(),
        },
      ],
      // 카테고리랑 연결이 되어 있음
    };
    dispatch(fetchProducts({ collectionName: "products", queryOptions }));
    // fetchProducts() => getdatas -> 데이터를 불러오려고 (state), state에 정보 넣어주는 게 action의 역할
    // fetch의 역할이 action을 만들어주는 역할을 한다.  action에 있는 type과 payload를 가져와야 되는데 후자만 없어서
    // payload를 가져와야 된다.
    // 카드리스트 페이지의 존재의미는 카드아이템에 정보를 가져다주기 위한 것
    // getdatas에 정보를 다 가져다주는 게 아니라 파라미터 6개 정도 만들어서 대신 받아줄 거임
    // 디스패치를 쓰는 거는 스테이트의 상태를 변화시키기 위해서 쓰는 거임
    // 셋함수는 유스스테이트에 나온 그 함수만 변화시킬 수 가 있다.
    // 스토어 하나에 다 관리되고 있으니까 디스패치 단 하나로 관리를 시키려는 거임
    // 액션에다가 타입과 페이로드를 집어넣는다.
  }, []);
  return (
    <ul className={styles.card_list}>
      {products.map((product) => {
        return <CardItem item={product} />;
      })}
    </ul>
  );
}

export default CardList;
