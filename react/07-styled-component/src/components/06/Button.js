import styled from "styled-components";

const SIZES = {
  large: 24,
  medium: 20,
  small: 16,
  // 픽셀 단위
};

const Button = styled.button`
  background-color: #6750a4;
  border: none;
  color: #fff;
  padding: 16px;
  font-size: ${({ size }) => SIZES[size] ?? SIZES["medium"]}px;
  /*props.size 함수형태로 작성함. size=문자 */
  /* 여기서는 백틱이 안 먹힘 이미 큰 백틱에 먹혀있기 때문에  */
  /* props도 구조분해 가능 (props) -> ({size}), [props.size] -> [size]*/
  border-radius: ${({ $round }) => ($round ? "9999px" : "3px")};
  /* 사망 연산자 사용, 있으면 9999px, 없으면 3px 하겠다.  */
  /* $round 앞에 달러 넣어서 표준속성 부여해줌  */
  &:hover {
    background-color: #463770;
  }
`;
// 인풋 라운들리 에러 만들기

export default Button;
