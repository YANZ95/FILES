import React, { useContext, useRef, useState } from "react";
import Header from "./Header";
import Button from "./Button";
import { emotionList } from "../uitll/emotion";
import EmotionItem from "./EmotionItem";
import "./DiaryEditor.css";
import { DiaryDisatchContext } from "../App";
import { Navigate, useNavigate } from "react-router-dom";

const INITIAL_VALUES = {
  date: "",
  content: "",
  emotion: 3,
};

function DiaryEditor(props) {
  // 앱 파일의 컨텍스트를 써줌 , function DiaryEditor,  useContext(DiaryDisatchContext)
  // 데이터를 추가하는 함수 - onCreate 함수, 이거를
  // 뭘로 넘겨주냐면 context로 넘긴다고 했음
  const { onCreate } = useContext(DiaryDisatchContext);
  // 1.날짜, 감정, 텍스트 관리할 상태를 만들어야한다.
  //   const [selectedEmotion, setSelectedEmotion] = useState(null);
  // 편하게 쓰려고 구조분해를 써주는 거
  //   const [date, setDate] = useState("");
  //   const [text, setText] = useState("");
  //   이렇게 따로 따로 만들면 너무 비효율적이다!!!!
  const [values, setValues] = useState(INITIAL_VALUES);

  //   2. 각각의 EmotionItem을 클릭했을 때 콘솔창에 emotion_id 를 출력해본다.
  //   const handleClick = (emotion_id) => {
  //     console.log(emotion_id);
  //     setSelectedEmotion(emotion_id);
  //   };
  // 3. 1번에서 만든 state의 값이 변경되도록 만든 후 개발자도구의 components 탭에서 확인
  const contentRef = useRef();
  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = () => {
    if (values.content.trim().length < 1) {
      handleChange("content", "");
      contentRef.current.focus();
      return;
    }
    if (window.confirm("새로운 일기를 저장하시겠습니까?")) {
      onCreate(values);
    }
    // 리액트는 버츄어돔만 써서 window를 붙여줘야 리액트가 인식함
    navigate("/", { replace: true });
  };

  // 4. 상태 변경 함수를 emotionItem의 onClick에 전달
  // 5.emotionItem_on_${id} 클래스가 적용될 수 있도록 만든다.

  // emotion 을 클릭했을 때 감정을 관리하는 상태의 값을 변경
  // 변경된 상태의 값과 emotion의 id가 같으면 isSelected 라는 props 을 전달해서
  // emotionItem_on_${id} 클래스가 적용될 수 있도록 만든다.
  return (
    <div className="diaryEditor">
      <Header
        headText={"새 일기 작성하기"}
        leftChild={<Button text={"<뒤로 가기"} />}
      />
      <div>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input_box">
            <input
              className="input_date"
              type="date"
              name="date"
              value={values.date}
              onChange={handleInputChange}
            />
          </div>
        </section>
        <section>
          <h4>오늘의 감정</h4>
          <div className="input-box emotion_list_wrapper">
            {emotionList.map((emotion) => {
              return <EmotionItem key={emotion.id} {...emotion} />;
              // {...emotion} 이렇게 쓰면 한꺼번에 보낼 수 있다.
            })}
          </div>
        </section>
        <section>
          <h4>오늘의 일기</h4>
          <div className="input_box text_wrapper">
            <textarea
              placeholder="오늘은 어땠나요"
              name="content"
              onChange={handleInputChange}
              value={values.content}
              ref={contentRef}
            />
          </div>
        </section>
        <section>
          <div className="control_box">
            <Button text={"취소하기"} />
            <Button
              text={"작성완료"}
              type={"positive"}
              onClick={handleSubmit}
            />
            {/* 일반 버튼이 아니라 대문자라서 컴퍼넌트임  버튼 컴퍼넌트를 쓸 때면 온클릭을 맞춰두면 됨 */}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DiaryEditor;
