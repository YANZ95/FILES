import React from "react";
import styled from "styled-components";
import Input from "./Input";

const Container = styled.div`
  ${Input} {
    margin: 10px;
  }
`;

export function Practice(props) {
  return (
    <Container>
      다이나믹 스타일링 연습
      <h2>Size</h2>
      <Input size="small"></Input>
      <Input size="medium"></Input>
      <Input size="large"></Input>
      <h2>Round</h2>
      <Input $round />
      <h2>Error</h2>
      <Input $error />
    </Container>
  );
}

// export function Practice(props) {
//   return (
//     <>
//       <sizeWrapper>
//         <h2>Size</h2>
//         <size1>
//           <input id="Size" type="text"></input>
//         </size1>
//         <size2>
//           <input id="Size" type="text"></input>
//         </size2>
//         <size3>
//           <input id="Size" type="text"></input>
//         </size3>
//       </sizeWrapper>
//       <RoundWrapper>
//         <input id="Round" type="text"></input>
//       </RoundWrapper>
//       <ErrorWrapper>
//         <input id="Error" type="text"></input>
//       </ErrorWrapper>
//     </>
//   );
// }
