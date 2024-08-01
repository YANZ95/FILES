import React from "react";
import Button from "./Button";
import "./DiaryItem.css";

function DiaryItem({ date, content, emotion }) {
  return (
    <div className="diaryItem e">
      <div className={`emotion_img_wrapperwrapper_1_${emotion}`}>
        <img src={`assets/emotion1${emotion}.png`} />
      </div>
      <div className="info_wrapper">
        <div className="diary_date">{new Date(date).toLocaleDateString()}</div>
        <div className="diary_content_preview">
          {`${content.slice(0, 25)}...`}
        </div>
      </div>
      <div className="btn_wrapper">
        <Button text={"수정하기"} />
      </div>
    </div>
  );
}

export default DiaryItem;
