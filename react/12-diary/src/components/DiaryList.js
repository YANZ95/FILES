import React, { useState } from "react";
import Button from "./Button";
import "./DiaryList.css";
import DiaryItem from "./DiaryItem";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const sortOptionList = [
  { name: "최신순", value: "latest" },
  { name: "오래된 순", value: "oldest" },
];
const filterOptionList = [
  { name: "전부다", value: "all" },
  { name: "좋은 감정만", value: "good" },
  { name: "안좋은 감정만", value: "bad" },
];

function ControlMenu({ optionList, value, onChange }) {
  return (
    <select
      className="ControlMenu"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {optionList.map((option, idx) => {
        return (
          <option key={idx} value={option.value}>
            {option.name}
          </option>
        );
      })}
    </select>
  );
}

function DiaryList({ diaryList }) {
  // diaryList 을 넣으면 필터링을 넣을 수 있다.
  const [order, setOrder] = useState("latest");
  const [filter, setFilter] = useState();
  const Navigate = useNavigate();

  const getSortedDiaryList = () => {
    // 필터링 함수
    const getFilteredList = () => {
      // filter state가 good 이면(emotion의 값이 3보다 작거나 같을 때)
      // filter state가 good 이 아니면(emotion의 값이 3보다 클 때)
    };
    // [1, 11, 21].sort((a,b) => b - a);
    // 정렬 함수
    const getOrderedList = () => {
      // order state가 latest 이면 b - a
      // order state가 latest 가 아니면 a - b
    };
    const filteredList = diaryList.filter((diary) => getFilteredList(diary));
    const sortedList = filteredList.sort(getOrderedList);
    return sortedList;
  };

  return (
    <div className="diaryList">
      <div className="menu_wrapper">
        <div className="control_menus">
          <ControlMenu optionList={sortOptionList} />
          <ControlMenu optionList={filterOptionList} />
        </div>
        <div className="new_btn">
          <Button
            text={"새 일기쓰기"}
            type="positive"
            onClick={() => Navigate("/new")}
          />
        </div>
      </div>
      {diaryList.map((diary) => {
        return <DiaryItem key={diary.id} {...diary} />;
        {
          /* 원래 같았으면 홈페이지에서 렌더링을 하는데 다이어리에서 컴포넌트를 만들어서 할 수도 있다. */
        }
      })}
    </div>
  );
}

export default DiaryList;
