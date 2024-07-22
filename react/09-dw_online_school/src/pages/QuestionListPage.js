import React, { useEffect, useState } from "react";
import ListPage from "./ListPage";
import styles from "./QuestionListPage.module.css";
import searchImg from "../assets/search.svg";
import QuestionItem from "../components/QuestionItem";
import { getDatas } from "../api/firebase";

let listItems;

function QuestionListPage(props) {
  const [items, setItems] = useState([]);

  const handleLoad = async () => {
    const resultData = await getDatas("questions");
    listItems = resultData; // 검색용으로 사용할 전체 데이터를 가지고 있어야 한다.
    setItems(resultData);
  };
  useEffect(() => {
    handleLoad();
  }, []);
  return (
    <ListPage variant="community">
      <form className={styles.form}>
        <input placeholder="검색으로 코스 찾기" />
        <button>
          <img src={searchImg} />
        </button>
      </form>
      <p className={styles.count}>총 {0}개 코스</p>

      <div className={styles.questionList}>
        {items.map((question) => (
          <QuestionItem key={question.docId} question={question} />
        ))}
      </div>
    </ListPage>
    //  코스리스트 페이지 문구를 가운데에 정렬시켜주는 역할은 컨테이너임
    // 코스리스트 페이지에서 리스트페이지를 만들었음
    // 이름, 설명 게시판 스타일로 되어있는데 (커뮤니티)
    // 밑에 부분을 따로 만들었음
    // 컴퍼넌츠가 따로 필요하다.
  );
}

export default QuestionListPage;
