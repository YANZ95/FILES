import React, { useContext, useEffect, useState } from "react";
import DiaryEditor from "../components/DiaryEditor";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import { changeTitle } from "../utill/changeTitle";

function EditPage(props) {
  // EditPage에서 DiaryEditor에 데이터를 넘기도록 만들기

  const { id } = useParams();
  const [data, setData] = useState();
  const { diaryList } = useContext(DiaryStateContext);
  const navigate = useNavigate();

  useEffect(() => {
    changeTitle(`감정 일기장 - ${id}번 일기 수정`);
  }, []);

  useEffect(() => {
    if (diaryList.length > 0) {
      const targetDiary = diaryList.find((diary) => diary.id == id);

      if (targetDiary) {
        setData(targetDiary);
      } else {
        alert("잘못된 접근입니다.");
        navigate("/", { replace: true });
      }
    }
  }, [diaryList]);

  return <div>{data && <DiaryEditor originData={data} isEdit={true} />}</div>;
}

export default EditPage;
