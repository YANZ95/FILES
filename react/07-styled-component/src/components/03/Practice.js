import React from "react";
import Input from "./Input";
import styled from "styled-components";

const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  /* display: flex;
  flex-direction: column; */
  ${Input} {
    display: block;
    width: 100%;
    margin: 8px 0 16px;
    box-sizing: border-box;
  }
  /* 네스팅 문법 사용한 거 */
`;

export function Practice(props) {
  return (
    <Container>
      <h1>로그인</h1>
      <label htmlFor="email">Email</label>
      <Input id="email" placeholder="styled@example.com" />
      <label htmlFor="password">Password</label>
      <Input id="password" />
    </Container>
  );
}

// export default pratice 지움 Main에 as 써서
