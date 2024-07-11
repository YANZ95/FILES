import styled from "styled-components";
// 데이터 전달하기 위한 플옵을 여기서도 사용 가능
const Box = styled.div`
  background-color: ${(props) => props.bgColor};
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    background-color: black;

    &:hover {
      background-color: white;
    }

    /* & 밖에  쓰면 div박스 */
  }
  /* span:hover {
    background-color: white;
  }   요렇게 안 쓰고 위처럼 씀*/
  &:hover {
    background-color: yellow;
  }
`;

export default Box;
