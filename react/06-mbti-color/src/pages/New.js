import React, { useState } from "react";
import styles from "./New.module.css";
import { Link } from "react-router-dom";
import MBTISelect from "../components/MBTISelect";
import ColorInput from "../components/ColorInput";
import generateColorCode from "../lib/generateColorCode";
import { addDatas } from "../lib/firebase";

const INIITIAL_VALUES = {
  mbti: "",
  colorCode: "",
};

function New(props) {
  const [formValue, setFormValue] = useState(INIITIAL_VALUES);
  // 사용자가 등록버튼을 여러번 누르는 걸 막아줘야 됨
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (name, value) => {
    setFormValue((prevFormValue) => {
      return { ...prevFormValue, [name]: value };
    });
  };

  const handleRandomClick = () => {
    const nextColorCode = generateColorCode();
    // 여기선 generateColorCode 하나만 실행시키면 됨
    handleChange("colorCode", nextColorCode);
  };

  const handleSave = async () => {
    const { mbti } = formValue;
    if (mbti.length < 4) {
      alert("mbti 를 선택해주세요.");
      return false;
    }

    setIsSubmitting(true);
    // 저장하기 위해서 파이어베이스 파일에 에드데이터스 만들어야 됨

    const result = await addDatas("mbtiColor", formValue);
    // 여기서 체크를 해야 될 게 있음
    // 저장됬는 지 확인해줘야 되서 아래 같이 만들어줌
    if (result) {
      alert("MBTI Color 등록을 성공했습니다.");
      setFormValue(INIITIAL_VALUES);
    } else {
      alert("MBTI Color 등록을 실패했습니다. \n관리자에게 문의하세요.");
    }
  };
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerHeading}>새 컬러 등록하기</h1>
        <Link className={styles.cancel} to="/">
          <img className={styles.cancelIcon} src="/images/x.svg" />
        </Link>
      </header>
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>MBTI</h2>
        <MBTISelect
          mbtiValue={formValue.mbti}
          handleChange={(newMbti) => handleChange("mbti", newMbti)}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>
          컬러
          <button className={styles.random} onClick={handleRandomClick}>
            <img className={styles.repeatIcon} src="/images/repeat.svg" />
          </button>
        </h2>
        <ColorInput
          colorCodeValue={formValue.colorCode}
          handleChange={(newColorCode) =>
            handleChange("colorCode", newColorCode)
          }
        />
      </section>
      <button className={styles.submit} onClick={handleSave}>
        컬러 등록
      </button>
    </div>
  );
}

export default New;
