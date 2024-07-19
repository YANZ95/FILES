import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import CloseButtonImg from "../assets/closeButton.svg";
import styles from "./WishListPage.module.css";
import CourseItem from "../components/CourseItem";
import { getData, updateDatas } from "../api/firebase";
import Warn from "../components/Warn";
import Button from "../components/Button";
import { Link } from "react-router-dom";

function WishListPage(props) {
  // courseList state 가 필요함
  //   courseList state가 필요하면 어떤 방법을 써야 되지?
  // const courseList=useState(); 틀림
  const [courseList, setCourseList] = useState([]);
  // 목족: 위시리스트에 있는 강의들을 저장할 상태를 관리
  // 컴포넌트가 강의 목록을 렌더링할 수 있게 만듬
  // 파이어베이스 멤버에서 가져옴
  const member = JSON.parse(localStorage.getItem("member"));
  // 키값은 어디에서 확인하냐면

  const handleLoad = async () => {
    const result = await getData("member", {
      // 스토어 코스의 정보 리절트에 다들어감
      field: "email",
      // 필드 뭐를 비교하냐면 조건.
      condition: "==",
      value: member.email,
    });
    setCourseList(result.courseList);
  };

  // handleLoad 함수에서 로그인 사용자의 email 로 member 문서 가져오고
  // 문서 안에 있는 courseList  를 state에 set해준다.
  // const handleLoad() {} 틀림
  // 문서 안에 있는 courseList를 state에 set해준다.
  //   const handleLoad = async () => {
  //     try {
  //       const userEmail = "yjw@naver.com";
  //        // 실제 로그인 사용자의 이메일로 변경해야 합니다.
  //       const response = await fetch(`/api/members/${userEmail}`);

  //       const data = await response.json();
  //       setCourseList(data.courseList);
  //     } catch (error) {
  //       console.error("Failed to load course list", error);
  //     }
  //   }; 챗 지피티

  const handleDelete = async (course) => {
    const result = await updateDatas("member", member.docId, course, {
      type: "DELETE",
      fieldName: "courseList",
    });
    handleLoad();
  };

  // useEffect 안에서 handleLoad 함수 실행
  useEffect(() => {
    handleLoad();
  }, []);
  //   챗지피티 그대로 됨
  return (
    <Container className={styles.Container}>
      <h1 className={styles.title}>나의 위시리스트</h1>
      {courseList.length === 0 ? (
        <>
          <Warn
            className={styles.emptyList}
            title="담아 놓은 코스가 없어요."
            description="카탈로그에서 나에게 필요한 코스를 찾아보세요."
          />
          <div className={styles.link}>
            <Link to="/courses">
              <Button>코스 찾아보기</Button>
            </Link>
          </div>
        </>
      ) : (
        <ul className={styles.items}>
          {/* li 부분 렌더링해야됨  */}
          {courseList.map((course) => {
            return (
              <li className={styles.item} key={course.slug}>
                <CourseItem course={course} />
                <img
                  className={styles.delete}
                  src={CloseButtonImg}
                  onClick={() => handleDelete(course)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}

export default WishListPage;
