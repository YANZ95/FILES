// import React from "react";
// import Input from "./Input";
// import Button from "./Button";
// import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import LoginButton from "./LoginButton";
import Input from "./Input";
import KakaoButton from "./KakaoButton";
import { getMember } from "../api/firebase";

const LoginContainer = styled.div`
  width: 400px;
  margin: 40px auto;

  ${LoginButton} {
    width: 100%;
    margin: 8px 0;
  }

  ${Input} {
    margin-bottom: 16px;
  }

  &::placeholder {
    color: #c4c5cd;
  }
`;

const Logo = styled.h1`
  font-family: Pretendard;
  text-align: center;
  font-size: 40px;
  background-image: linear-gradient(135deg, aqua, purple);
  background-clip: text;
  color: transparent;
  /* 클립이 없으면 배경만 깔리고 글이 사라짐 */
  /* 투명도를 부여하면 배경이 사라지고 배경색깔이 글씨에 투영됨 */
`;

const Description = styled.div`
  color: #848187;
`;

const Label = styled.label`
  color: #e1c6f7;
`;
/* e다른 데서 쓸 것 같으면 각각 컴포넌트로 따로 만들어야 됨 */

// const handleChange = () => {};

function Login(props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  // 네비게이트 함수를 변수에 넣어서 선언함
  const [values, setValues] = useState({
    // 요 타겟에는 굉장히 많은 정보들이 있는 데 그 중에서 이메일을 바꿀 지 패스워드를 바꿀 지
    // 바꿔주는 요소는 네임이다.
    email: "",
    password: "",
  });
  // 밸류만 가지고 사용자가 어디에 입력했는 지 모른다.

  const handleChange = (e) => {
    const { name, value } = e.target;
    // const { value }
    // setValues(function(prevValues){
    //   return {...prevValues, [name]: value};
    // })
    // 일반함수
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    // 화살표 함수, 똑같은 거를 다른 방식으로 쓴 거
    // 일반함수로도 가능하지만 화살표함수가 더 간단하고 쉬워서 화살표함수 사용함
    // 리액트에서는 주로 화살표함수를 사용하지만 실무에서는 일반함수 많이 사용함
  };

  const handleLogin = async (e) => {
    // 기본 submit 이벤트를 막는다.
    e.preventDefault();
    // 파이어베이스에 접근해서 사용가 입력한 이메일을 가진 member를 조회한다.
    const { memberObj, message } = await getMember(values);
    if (Object.keys(memberObj).length === 0) {
      // 로그인 실패
    } else {
      // 로그인 성공
      localStorage.setItem("member", JSON.stringify(memberObj));
      alert(message);
      // 메인으로 보내려면
      // window.Location.href="/"; <- 리액트에서는 이거 쓰면 안 됨. 깜빡거림. 처음부터 다시 로딩하게 됨
      navigate(state ? state : "/", { replace: true });
      // 위에서 변수 선언하고 이렇게 써줘야됨
      // 뒤로 가기 없애는 방법 {replace: true} 객체형식으로 넣어줌
      // 삼환연산자 사용
    }
  };
  // 배열 비어있는 지 확인하는 방법 독스에 들어있는 지 확인했는데 그 때 배열의
  // 길이, 랭스를 확인했다. 객체에는 랭스가 없고 키값을 써야 된다. 그러면 어떻게 해야되냐면
  // 객체의 키값을 어떻게 아냐면 키스 함수 그거 결과는 키값만 배열로 나왔는데 비어있으면 키가 하나도
  // 없다는 뜻이다. 라이브러리 같은 건 있는데 그게 없다면 이런 식으로 해결을 해야 한다.
  return (
    <LoginContainer>
      <Logo>DW 온라인스쿨</Logo>
      <Description>
        회원이 아니신가요? <Link>회원가입 하기</Link>
      </Description>
      <form onSubmit={handleLogin}>
        <Label htmlFor="email">이메일</Label>
        <Input
          type="email"
          id="email"
          placeholder="styled@DW.kr"
          onChange={handleChange}
          name="email"
        />
        <Label htmlFor="password">비밀번호</Label>
        <Input
          type="password"
          id="email"
          placeholder="비밀번호"
          onChange={handleChange}
          name="password"
        />
        <LoginButton>로그인 하기</LoginButton>
      </form>
      <KakaoButton>카카오 로그인</KakaoButton>
    </LoginContainer>
    // flex로도 만들 수 있으나 그렇게 하면 div 여러개를 감싸야됨
  );
}

export default Login;

// function Login(props) {
//   return (
//     <div>
//       <h2>DW 온라인스쿨</h2>
//       <p>
//         회원이 아니신가요?<Link>회원가입 하기</Link>
//       </p>
//       <label>이메일</label>
//       <Input placeholder="styled@DW.kr" />
//       <label>비밀번호</label>
//       <Input placeholder="비밀번호" />
//       <Button>로그인 하기</Button>
//       <Button>카카오 로그인</Button>
//     </div>
//   );
// }

// export default Login;
