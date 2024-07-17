import React from "react";
import CourseIcon from "./CourseIcon";
import { Link } from "react-router-dom";
import styles from "./CourseItem.module.css";
import Card from "./Card";
import getCourseColor from "../utils/getCourseColor";

const DIFFICULTY = ["입문", "초급", "중급", "고급"];

function CourseItem({ course }) {
  const { title, summary, language, difficulty, code, photoUrl } = course;
  const courseColor = getCourseColor(code);
  const thumbStyle = {
    borderColor: courseColor,
  };
  // 객체로 넣어줘야 됨

  return (
    <Card className={styles.courseItem}>
      <div className={styles.thumb} style={thumbStyle}>
        <CourseIcon photoUrl={photoUrl} />
        {/* 여기에 코스아이콘 사용할 거임 */}
        {/* 12번째 줄에서 포토 구조분해하고 여기 넣어놓음 */}
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>
          <Link>{title}</Link>
          {/* <Link>프로그래밍 기초 in Python</Link> */}
        </h2>
        <p className={styles.description}>
          {summary}
          {/* 웹/앱 개발, 데이터 분석, 인공지능/머신러닝, 업무 자동화 등으로
          나아가기 위한 첫 걸음! */}
        </p>
        <div>
          <ul className={styles.tags}>
            {/* <li>PYHTHON</li> */}
            <li>{language}</li>
            <li>{DIFFICULTY[difficulty]}</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default CourseItem;
