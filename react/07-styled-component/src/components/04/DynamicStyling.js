import React from "react";
import Button from "./Button";
import styled from "styled-components";

const Container = styled.div`
  ${Button} {
    margin: 10px;
    /*마진은 상황에 따라 다르게 적용되기 때문에  */
    /* 한 개만 있으면 마진이 필요없음 그런 경우가 있어서 */
    /* 마진을 버튼에 종속시키는 게 아니라 컨테이너에 종속시킴 */
  }
`;
// 네스팅 -> 중첩해서 선택하는 것

function DynamicStyling(props) {
  // prov 전달할 때 험수처럼 전달함
  // 글자 크기부터 다르게 설정함
  return (
    <Container>
      <h1>기본 버튼</h1>
      <Button size="small">small</Button>
      <Button size="medium">medium</Button>
      <Button size="large">large</Button>
      <h1>둥근 버튼</h1>
      <Button size="small" $round>
        round small
      </Button>
      <Button size="medium" $round>
        round medium
      </Button>
      <Button size="large" $round>
        round large
      </Button>
    </Container>
    // 프롭 전달받아서 할 껀데 우리가 전달할 어떤 프롭이 있으면
    // 둥글게 만들고 아니면 사각지게 만듬
    // 태그마다 배운 속성들이 있는데 콘솔 창에서는 오류가 나지 않았는데
    // 라운드 넣자마자 오류 생김. 표준속성이라고 해놓은 게 있는데
    //  외울필요 X, 오류나는 애들은 비표준속성이라서 생긴 거임
    // 전달하는 프롭들은 달라 표시하는 게 좋다. 비표준속성 막아주는 기능인데
    // 오류를 막아준다. 버튼 컴퍼넌트에서 쓴 애들은 달라표시 ㄱㄱ
    // 변수명 자체가 달라 라운드인 거임
  );
}

export default DynamicStyling;
