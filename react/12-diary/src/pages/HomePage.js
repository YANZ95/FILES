import React, { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import DiaryList from "../components/DiaryList";

function HomePage(props) {
  const [curDate, setCurDate] = useState(new Date());
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

  const increaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1));
    // setCurDate((prevDate) => {
    //   const newDate = new Date(prevDate);
    //   newDate.setMonth(newDate.getMonth() + 1);
    //   return newDate;
    // });
  };
  const decreaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1));
    // setCurDate((prevDate) => {
    //   const newDate = new Date(prevDate);
    //   newDate.setMonth(newDate.getMonth() - 1);
    //   return newDate;
    // });
  };
  return (
    <div>
      <Header
        headText={headText}
        leftChild={<Button text={"<"} onClick={decreaseMonth} />}
        rightChild={<Button text={">"} onClick={increaseMonth} />}
      />
      <DiaryList />
    </div>
  );
}

export default HomePage;
