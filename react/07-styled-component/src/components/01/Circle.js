import styled from "styled-components";
import Box from "./Box";
import { keyframes } from "styled-components";

const CircleAnimation = keyframes`
0% {
    background-color: red;
}
33% {
    background-color: green;
}
66% {
    background-color: blue;
}
100% {
    background-color: red;
}
`;

const Circle = styled(Box)`
  border-radius: 50%;
  animation: ${CircleAnimation} 3s linear infinite;
`;
// 스타일 상속받는 거
// 위에 먼저 선언하고 컴포넌트 안에 써야 오류가 안 남 ->CircleAnimation
// 가상선택자 알아볼거임

export default Circle;
