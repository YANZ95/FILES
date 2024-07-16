import React from "react";
// 리액트 추출
import Container from "../components/Container";
// 컨테이너 추출
import styles from "./ListPage.module.css";
// 리스트 css파일 추출
import cn from "classnames";
// 클래스네임 추출
import caltalogImg from "../assets/catalog.svg";
// 카탈로그 이미지 추출

function ListPage(props) {
  return (
    <>
      <div className={cn(styles.bg, styles.catalog)}>
        {/* 리스트 페이지가 하는 역할은 요 부분이 커뮤니티 카탈로그일 때
            내용만 다르고 모양은 같은데 나머지 하위녀석들을 보여줄건데
            그녀석들을 칠드런으로 보여줄거다! */}
        {/* 임포트에 동시에 두개를 써줘야되는 상황이면 변수로 써주거나 클래스네임즈 요게 있다~ */}
        {/* 달라지면 이미지, 텍스트가 바뀌어야 되는데 리스트 컴포 */}
        <img className={styles.icon} src={caltalogImg} />
        <div className={styles.texts}>
          <h1 className={styles.heading}>모든 코스</h1>
          <p className={styles.description}>
            자체 제작된 코스들로 기초를 쌓으세요.
          </p>
        </div>
      </div>

      <Container></Container>
    </>
  );
}

export default ListPage;
