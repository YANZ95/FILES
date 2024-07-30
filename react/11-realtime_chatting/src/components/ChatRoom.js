import React, { useEffect, useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { addDatas, db, getQuery, getRealTimeMessages } from "../api/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

function ChatRoom({ auth }) {
  const [inputValue, setInputValue] = useState("");
  // const [messages, setMessages] = useState([]);
  const conditions = [];
  const orderBys = [{ field: "createdAt", direction: "asc" }];
  const LIMITS = 100;
  const q = getQuery("messages", { conditions, orderBys, limits: LIMITS });
  // 변수면 변수인데로 키가 안 들어감
  const [messages] = useCollectionData(q);
  const dummy = useRef();
  // const auth = getUserAuth();

  const sendMessage = async (e) => {
    // 메세지보내주는 함수 선언, 파이어베이스 연결되는 어씽크 사용,
    // 이벤트 함수 파라미터로 넣는다.
    e.preventDefault();
    // 저장할 데이터 객체를 생성한다, (text, createdAt, photoUrl, uid)
    const { uid, photoURL } = auth?.currentUser;
    const addObj = {
      text: inputValue,
      createdAt: serverTimestamp(),
      uid: uid,
      photoURL: photoURL,
    };
    // 데이터베이스에 객체를 저장한다.
    await addDatas("messages", addObj);
    // inputValue 를 빈 문자열로 셋팅한다.
    setInputValue("");
  };

  // useEffect(() => {
  //   const unsubscribe = getRealTimeMessages("messages", setMessages);
  // const collect = collection(db, "messages");
  // const q = query(collect, orderBy("createdAt"), limit(100));
  // // 리미트는 카톡에서 중요한 요소임
  // // 날짜기준(createdAt)으로 오름차순으로 순서(orderBy)가 나온다.
  // const unsubscribe = onSnapshot(q, (snapshot) => {
  //   // 지금까지 화살표함수로 만들었음. 모양은 다르지만 함수가
  //   // 튀어나온다. 그러니까 여기에 있는 걸 실행시킨다. 클린업함수
  //   const resultData = snapshot.docs.map((doc) => doc.data());
  //   setMessages(resultData);
  //   // console.log(snapshot);
  //   //  snapshot.forEach(doc => {
  //   //   console.log(doc.data());
  //   //  });
  // });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  // useEffect(() => {
  //   // scrollIntoView() 함수는 자신이 호출된 요소가 사용자에게 표시되도록
  //   // 상위 컨테이너를 스크롤한다.
  //   dummy.current.scrollIntoView({ behavior: "smooth", block: "start" });
  // }, [messages]);

  return (
    <>
      <main>
        {messages?.map((message, idx) => {
          return <ChatMessage key={idx} message={message} auth={auth} />;
        })}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <button type="submit" disabled={!inputValue}>
          <FaIcons.FaPaperPlane />
        </button>
      </form>
    </>
  );
}

export default ChatRoom;
