import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import CourseIcon from "../components/CourseIcon";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import getCourseColor from "../utils/getCourseColor";
import { getData, updateDatas } from "../api/firebase";
import styles from "./CoursePage.module.css";

function CoursePage({}) {
  const props = useLocation();
  const { pathname } = props;
  const { courseSlug } = useParams();
  //   console.log(slug);
  // const props = useLocation();
  //   console.log(props);
  // 간단한 정보만 이렇게 넘겨서 사용한다. 중요정보는 탈취의 위험이 있음
  const navigate = useNavigate();

  const [course, setCourse] = useState();

  // if(courses) {
  //     getCourseColor(course.code)
  //   }
  // 조건 문 쓸 수 있는 걸 아래처럼 쓴다.

  //   undefined.code
  // undefined 여기서 그냥 끝
  const courseColor = getCourseColor(course?.code);

  //  getCourseColor(course.code);점 쓰고 쓰면 무조건 오류가 날 거다. 근데 여기다 점을 쓴 이유가 뭘까?
  // 코스가 들어있기 때문에 오류가 나서 이럴 땐 옵셔널체이닝이라는 방법을 쓴다.
  //   점 앞에 물음표 사용하는 걸 말함

  const handleLoad = async () => {
    const resultData = await getData("courses", {
      field: "slug",
      condition: "==",
      value: courseSlug,
    });
    setCourse(resultData);
  };

  const handleAddWishlistClick = async () => {
    const member = JSON.parse(localStorage.getItem("member"));
    // 이런 것도 가능하면 공동함수로 만들어놓는게 편리함
    if (member) {
      // 로그인된 상태
      const result = await updateDatas("member", member.docId, course, {
        // result -> true or false
        type: "ADD",
        fieldName: "courseList",
      });
      if (result) {
        navigate("/wishlist");
      } else {
        alert("코스 담기를 실패했습니다. \n 관리자에게 문의하세요.");
        // \n -> 개행
      }
    } else {
      alert("로그인을 해주세요.");
      // 안 된 상태
      Navigate("/login", { state: pathname });
      //   경로 슬래시 반드시 해줘야됨
      // 기록 남기기 싫어 ~ -> replace to 사용
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  //   const { photoUrl } = course;
  return (
    <>
      <div className={styles.header}>
        {/* 앞에 div 요소가 있으면 만든 선택자들이 적용이 안 될 수 있어서 //
      프레그먼트를 사용해준다. */}
        <Container className={styles.content}>
          <CourseIcon photoUrl={course?.photoUrl} />
          <h1 className={styles.title}>{course?.title}</h1>
          <Button variant="round" onClick={handleAddWishlistClick}>
            + 코스 담기
          </Button>
          <p className={styles.summary}>
            {course?.summary}
            {/* 머신 러닝이 우리 생활 속에서 어디에 사용되고, 어떻게 적용되는지 실전
            예제를 통해 알아 보아요! */}
          </p>
        </Container>
      </div>
      <Container className={styles.topics}>
        {course?.topics.map(({ topic }) => {
          return (
            <Card key={topic.slug} className={styles.topic}>
              <h3 className={styles.title}>{topic.title}</h3>
              {/* 추천 시스템 */}
              <p className={styles.summary}>
                {topic.title}
                {/* 추천 시스템이란 무엇이고, 우리 생활에 어떤 영향을 미치고
                있을까요? 이번 토픽에서 추천 시스템이 우리의 생활을 어떻게
                지배하고 있는지를 배워봅시다! */}
              </p>
            </Card>
          );
        })}
      </Container>
    </>
  );
}
export default CoursePage;
