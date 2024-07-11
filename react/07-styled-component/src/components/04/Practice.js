import React from "react";
import Input from "./Input";
import styled from "styled-components";

const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  /* display: flex;
  flex-direction: column; */
  ${input} {
    display: block;
    margin: 100%;
    box-sizing: border-box;
  }
  /* 네스팅 문법 사용한 거 */
`;

export function Practice(props) {
  return (
    <div>
      <h1>로그인</h1>
      <label htmlFor="email">Email</label>
      <Input id="email" />
      <label htmlFor="password">Password</label>
      <Input id="password" />
    </div>
  );
}
