import React, { useEffect, useState } from "react";
import ListPage from "./ListPage";
// import ListPage from "../components/ListPage";
import SearchImg from "../assets/search.svg";
import styles from "./CourseListPage.module.css";
import CourseItem from "../components/CourseItem";
import { getDatas } from "../api/firebase";

// 따로 만들까 만들까 왜 고민했냐면 다른 컴포넌트에서도 쓸 가능성이 있어서

let listItems;

function CourseListPage({ course }) {
  const [items, setItems] = useState([]);
  // 안에 대괄호 안 넣으면 맵이 없다고 뜬다. 우리는 배열로 쓸 거라서 대괄호 넣음
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleKeywordChange = (e) => {
    // 사용자가 입력한 키워드를 state에 저장한다.
    setKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    // submit 막아줘야 되서
    e.preventDefault();
    // 전체 데이터를 가지고 있는 listItems 를 활용해
    // 사용자가 입력한 키워드를 title에 포함하고 있는 객체를 원소로 가지는 배열을 만든다.

    // const searchItems = listItems.filter(function(item) {
    //   return item.title.includes(keyword);
    // })
    // 검색할때 대소문자 상관없이 검색되게 하고 싶으면
    // item.title.keyword 소문자로 바꿔서 비교하게 한다.
    // 바꿔서 위는 주석해주고 아래 써줌

    // [{..., ..., title: "프로그래밍 in Javascript"},]
    // 만든 배열을 items state 에 set 해준다.
    setItems(listItems.filter(({ title }) => title.includes(keyword)));
  };

  const handleLoad = async () => {
    // 1. firebase의 courses  컬렉션의 데이터를 가져온다.
    // mock 데이터의 형태 가져오는 거임.파이어베이스에서 한다.
    // const { resultData, lastQuery } = await getAllDatas("mbtiColor", "id");
    setIsLoading(true);
    const resultData = await getDatas("courses");
    // 전체데이터 변수에 저장
    listItems = resultData;
    // 2. 가져온 데이터 콘솔로 확인.
    console.log(resultData);

    // 맞춤
    // 3. items state에 set 해준다.
    // const {} = await getAllDatas();
    // setItems(resultData);
    setItems(resultData);
    // 아래 유즈 이펙트 써주고 만들어준다.
    setIsLoading(false);
    // 다른 거 보고서라도 쳐보기, 직접 해봐야 실력이 늘음
    // 미리 안 해보면 나중에 해볼 때 당황하게 된다.
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <ListPage variant="catalog">
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          value={keyword}
          onChange={handleKeywordChange}
          placeholder="검색으로 코스 찾기"
        />
        <button>
          <img src={SearchImg} />
        </button>
      </form>
      <p className={styles.count}>총 {items.length}개 코스</p>

      {items.length === 0 && !isLoading ? (
        <warn
          className={styles.emptyList}
          title="조건에 맞는 코스가 없어요."
          description="올바른 검색어가 맞는지 다시 한 번 확인해 주세요."
        />
      ) : (
        <div className={styles.courseList}>
          {/* <div className={course}> */}
          {/* <div className={styles.courseList}> */}
          {items.map((course) => {
            return <CourseItem key={course.docId} course={course} />;
            // 같은 여러 자식 컴퍼넌트를 만들 때는 반드시 키값이 필요하다.
            // 안그러면 누가 누군지 구별을 하지 못한다.
            // 코스라는 변수로 전달. 저 코스라는 변수는 외계 변수
            // 근데 화살표 함수에서 쓸 수 있는 거는 course 밖에 없다.
          })}
        </div>
      )}
    </ListPage>
    // <div>코스리스트 페이지</div>
    //  코스리스트 페이지 문구를 가운데에 정렬시켜주는 역할은 컨테이너임
    // 코스리스트 페이지에서 리스트페이지를 만들었음
    // 이름, 설명 게시판 스타일로 되어있는데 (커뮤니티)
    // 밑에 부분을 따로 만들었음
    // 컴퍼넌츠가 따로 필요하다.
    //      <CourseItem />
  );
}

export default CourseListPage;
