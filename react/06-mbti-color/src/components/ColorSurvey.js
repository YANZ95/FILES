import React from "react";
import styles from "./ColorSurvey.module.css";

function ColorSurvey({ mbtiData }) {
  // const mbtiData = props.mbtiData;
  // const { mbtiData } = props;
  const { id, mbti, colorCode } = mbtiData; //객체 중괄호, mbtiData에서 뽑아온다.
  // {mbtiData.id},{mbtiData.mbti}=> 밑에 것 11,12
  return (
    <div className={styles.colorSurvey}>
      <div className={styles.id}>{id}</div>
      <div className={styles.mbti}>{mbti}</div>
      <div className={styles.arrow}>
        <img className={styles.arrowIcon} src="/images/arrow.svg" />
      </div>
      <div
        className={styles.colorChip}
        style={{ backgroundColor: mbtiData.colorCode }}
      ></div>
      <div className={styles.colorCode}>{mbtiData.colorCode}</div>
    </div>
  );
}

export default ColorSurvey;
