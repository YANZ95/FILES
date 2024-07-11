import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import ColorSurvey from "../components/ColorSurvey";
import mockItems from "../lib/mock.json";
import { getAllDatas } from "../lib/firebase";

function Home(props) {
  // const itemState = useState([]);
  // const items = itemState[0];
  // const setItems = itemState[1];
  const [items, setItems] = useState([]);
  const nextPageRef = useRef(null);
  // 렌더링이 되어도 저장만 하면 되서 useRef에 저장을 한다
  const handleLoad = async () => {
    // 파이어베이스에서 데이터 가져오기
    // 핸들로드는 최초로 렌더링할 때 실행하는 함수?????????
    const { resultData, lastQuery } = await getAllDatas("mbtiColor", "id");
    // 리저트데이터를 셋함수를 해서 데이터를 가질 수 있는데 라스트쿼리까지는 필요없음 라스트페이지넘
    // item state에 셋팅
    setItems(resultData);
    // 렌더링될 때 위에 유즈스테이트에 넣어줌
    nextPageRef.current = lastQuery;
  };

  const handleLoadNext = async () => {
    // handleLoadNext 실행되는 시점: 바닥에 닿았을 때s
    // 10 개 데이터 불러오는 로직 불러오기 전에
    // 스크롤 이벤트를 불러올 거임
    const { resultData, lastQuery } = await getAllDatas(
      "mbtiColor",
      "id",
      nextPageRef.current
    );

    if (resultData.length !== 0) {
      setItems((prevItems) => [...prevItems, ...resultData]);
      nextPageRef.current = lastQuery;
    } else {
      nextPageRef.current = null;
    }

    setItems((prevItems) => [...prevItems, ...resultData]);
    // const [items, setItems] = useState([]); 기존 아이템즈에..뭘 넣는다고 했는데
    // resultData가 있냐 없냐 확인해야 되는 거 아님?
    console.log(nextPageRef);

    nextPageRef.current = lastQuery;
    // 21번째부터 나와야 되서
  };

  useEffect(() => {
    handleLoad();
  }, []); //대괄호가 없어 렌더링이 계속 되던거임
  // 요소가 온스크롤되는 요소가 여기에 없음, 화면전체에 있음. 그럼 윈도우 객체에 거는 검
  // 그걸 유즈 임펙트에 걸건데 그 이유는 나중에 말해줌
  // 화면에 렌더링되자마자 유즈임펙트에 걸거임
  useEffect(() => {
    function handleScroll() {
      if (!nextPageRef.current) return false;
      // scrollHeight: 문서 전체의 높이
      // =
      // scrollTop: 문서의 처음부터 화면에 보이기 전까지의 높이(내려온 스크롤 높이)
      // +
      // clientHeight: 화면에 보여지는 높이
      //  바닥에 내려왔을 때 (위에)
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      //  document 요소를 불러올거임
      //  const ~ -> 타이핑게임할 때 쓴거임
      if (scrollTop + clientHeight >= scrollHeight) {
        // alert("스크롤이 바닥에 닿았다!!!");
        handleLoadNext();
      }
      console.log(`scrollHeight, scrollTop, clientHeight: ${scrollHeight}, ${scrollTop}, ${clientHeight})
`);
    }

    window.addEventListener("scroll", handleScroll); // 이건 원래 지워야 됨

    // 리액트 컴포넌트 라이프사이클
    // render() => constructor() => componentDidMount() => componentDidUpdate()
    //  => componentWillUnmount()

    // render: 컴포넌트의 기능과 모양을 정의하는 함수로 리액트 요소를 반환한다.
    // constructor: 컴포넌트를 만들 때 처음으로 호출되는 함수이다.  여기에서 state의 초기값이 설정된다.
    // componentDidMount: 컴포넌트를 생성하고 첫 렌더링이 끝났을 때 호출되는 함수이다.

    // componentDidUpdate() 요게  업데이트 시에 실행되는 함수
    //  업데이트 되는 경우 : props 값 변경, state 값 변경, 부모 컴포넌트가 리렌더링 될 때
    // componentDidUpdat: 컴포넌트 업데이트 작업이 끝난 후에 호출되는 함수이다.

    // 언마운트
    // 컴포넌트가 DOM에서 제거되는 것
    // componentWillUnmount: 해당 컴포넌트가 제거되기 직전에 호출된다.

    return () => {
      // alert("사이드 임펙트 정리 함수 실행 ");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // 마운트된다와 렌더링된다라는 말은 서로 다른 말임
  // 사실 그녀석이 언마운트 과정을 거친다는 것은 컴포넌트 재렌더링되기 전에
  // 언마운트된다는 것임

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <header className={styles.header}>
          <h1 className={styles.heading}>
            MBTI별
            <br />
            <span className={styles.accent}>좋아하는 컬러</span>
          </h1>
          <div>
            <div className={styles.filter}>
              <img className={styles.removeIcon} src="/images/x.svg" />
            </div>
          </div>
        </header>
      </div>
      <main className={styles.content}>
        <Link className={styles.addItem} to="/new">
          + 새 컬러 등록하기
        </Link>
        <ul className={styles.items}>
          {items.map((item, idx) => {
            return <ColorSurvey key={idx} mbtiData={item} />;
          })}
        </ul>
      </main>
    </div>
  );
}

export default Home;
