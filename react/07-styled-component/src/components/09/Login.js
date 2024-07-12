// import React from "react";
// import Input from "./Input";
// import Button from "./Button";
// import { Link } from "react-router-dom";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import KakaoButton from "./KakaoButton";

const Container = styled.div`
  width: 400px;
  margin: 40px auto;

  ${Button} {
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

function Login(props) {
  return (
    <Container>
      <Logo>DW 온라인스쿨</Logo>
      <Description>
        회원이 아니신가요? <Link>회원가입 하기</Link>
      </Description>
      <form>
        <Label htmlFor="email">이메일</Label>
        <Input type="email" id="email" placeholder="styled@DW.kr" />
        <Label htmlFor="password">비밀번호</Label>
        <Input type="password" id="email" placeholder="비밀번호" />
        <Button>로그인 하기</Button>
      </form>
      <KakaoButton>카카오 로그인</KakaoButton>
    </Container>
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
