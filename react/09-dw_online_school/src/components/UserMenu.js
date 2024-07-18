import React, { useEffect, useState } from "react";
import personImg from "../assets/person.png";
import { Link } from "react-router-dom";
import styles from "./UserMenu.module.css";

function UserMenu(props) {
  // 페이지가 바뀐다는 것은 윈도우객체가 없어지는 것은 아닌데
  // 정리되는 시점 - 윈도우 객체에 달아준 클릭핸들러를 언젠가는 없애줘야됨
  // 윈도우 정리하는 거 언제 썻는 지 - 리턴 써주고 함수 썻다. 클린업 함수, 리무브이벤트리스너
  const [isOpen, setIsOpen] = useState(false);
  //   버튼 클릭했을 때 보이고 안 눌렀을 때 안 보이게 하는 걸 관리하는 거
  // 조건부 렌더링
  const isLogined = JSON.parse(localStorage.getItem("member"));
  // 바꿔줘야 되는 부분
  // 로컬 스토리지 들어가서 멤버 가져온다. 문자열로 되어있는 애 가져와서 객체로 데려온다.
  // 그 역할을 하는게  제이슨 파스다.
  // 삼환 연산자 member ? true : false

  const handleClick = (e) => {
    // 버블링 모르면, 아예 못만듬.
    // 클릭 이벤트 핸들러는 핸들 아웃사이드다.
    // 버튼 누르면 버블링 막아줘야됨(윈도우까지 가는거)
    // 버블링 막는거 => e.stopPropagation();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // 유즈임펙트 실행되는 시점 1.값이 변경될때 /???
    if (!isOpen) return;
    const handleClickOutside = () => {
      setIsOpen(false);
      //   alert("window click handler");
    };
    //  handleClickOutside 바깥쪽을 누르면, ~ false를 누르게 된다.
    window.addEventListener("click", handleClickOutside);
    // 요 녀석을 누르면 아무것도 일어나지 않는데 그 이유는
    return () => {
      window.removeEventListener("click", handleClickOutside);
      //   컴포터 언마운트 될때 윈도우에서 제거해줘야됨
      // 이거를 제거해줘야되는 이유는 다른 페이지나 빈 공간에서 실행될 수 도 있고
      // 클릭 이벤트가 하나만 있어줘도 되서 넣어줬다 뺏다 해주는 거임
      // 이렇게 하면 얼라트가 한번씩만 실행된다.
      //
    };
  }, [isOpen]);
  //   윈도우 객체에 클릭이 들어감

  return (
    <div className={styles.userMenu}>
      {/* 핸들러 작성했을때 핸드러 변경하는 버튼 작성해보기 */}
      <button className={styles.iconButton} onClick={handleClick}>
        {/* 조건부 렌더링하는 만큼 넣어줬다. 논리 연산자 - 펄시한 값이 아니다~ */}
        <img src={personImg} />
      </button>
      {isOpen && (
        <ul className={styles.popup}>
          {/* 위시리스트 회원가입 로그인 누르면  */}
          <Link to="/wishlist">
            <li>위시리스트</li>
          </Link>
          <li className={styles.disabled}>회원가입</li>
          {/* {!isLogined ? () : ()} */}
          {/* 헷갈릴 때 삼환연산자 사용한다.  */}
          {!isLogined ? (
            <Link to="/login">
              <li>로그인</li>
            </Link>
          ) : (
            /**/ /* 부정연산자가 되어있으면 트루 아니면 펄스 */
            <Link to="/logout">
              <li>로그아웃</li>
            </Link>
          )}
        </ul>
      )}
    </div>
  );
}
// 중괄호 안에서 중괄호 주석 넣으면 오류 나서 주석넣을 때 중괄호 없애야 됨

export default UserMenu;
