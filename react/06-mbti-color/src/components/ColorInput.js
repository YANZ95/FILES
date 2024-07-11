import React from "react";
import styles from "./ColorInput.module.css";

function ColorInput({ colorCodeValue, handleChange }) {
  const onChange = (e) => {
    handleChange(e.target.value); // 요 함수가 핸들체인지 함수 안으로 들어감
  };
  const isValidColorCode = (colorCodeValue) => {
    //정확한 컬러코드인지 확인하는 코드 만들기
    // 첫자리 #, 뒤에 여섯자리는 영소문자 a-f,  영대문자 A-f, 숫자 0-9
    const regxp = /^#[a-fA-F0-9]{6}$/;
    return regxp.test(colorCodeValue);
    // 테스트한 결과가 나옴
    // 맨 위에 있는 colorCodeValue가 빈 칸에 들어감
  };
  const handleBlur = () => {
    if (!isValidColorCode(colorCodeValue)) {
      // 잘못된 코드를 입력했을 때
      alert(
        "컬러코드가 '#'과 함께 영소문자 a-f, 영대문자 A-F, 숫자 0-9 를 조합한 일곱자리르 입력하세요."
      );
      handleChange("#000000");
    }
  };
  return (
    <div className={styles.colorInputContainer}>
      {/* 커서 떨어질 때 발생하는 이벤트 => 체인지 눈? */}
      <input
        className={styles.colorInput}
        value={colorCodeValue}
        maxLength={7}
        onChange={onChange}
        onBlur={handleBlur}
      />
      <span
        className={styles.colorInputChip}
        style={{ backgroundnColor: colorCodeValue }}
      ></span>
    </div>
  );
}

export default ColorInput;
