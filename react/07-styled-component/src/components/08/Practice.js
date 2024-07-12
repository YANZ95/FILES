import React from "react";
import Input from "./Input";
import styled from "styled-components";
import searchImg from "./search.png";

const SearchInput = styled(Input)`
  background-image: url(${searchImg});
  background-size: 16px;
  /* 100px하면 돋보기 중간 일부만 나옴 */
  background-repeat: no-repeat;
  /* 창 안의 돋보기 무한반복되지 않게 설정함. 하나만 나옴 */
  background-position: left 12px top 50%;
  /* 돋보기 위치 조정. 안 할 때는 돋보기가 위에 쳐우쳐져 있음 */
  padding-left: 40px;
`;

export function Practice(props) {
  return (
    <div>
      <h2>Input</h2>
      <Input />
      <h2>Search Input</h2>
      <SearchInput />
    </div>
  );
}
// export function Practice(props) {
//   return (
//     <div>
//       <h2>Input</h2>
//       <Input $Input />
//       <h2>Search Input</h2>
//       <Input $SearchInput />
//     </div>
//   );
// }
