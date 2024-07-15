import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyle = createGlobalStyle`
// 전체적인 완전 공통 css 관리하는 곳임
${reset}
body {
background: ${({ theme }) => theme.bgColor};
// ({theme}) =>  밑에 버튼 누를 때 두 버튼 둘 중 하나를 고를 때 전달되게 만듬
   color: ${({ theme }) => theme.textColor};
 position: relative;
        display: block;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        font-family: Pretendard, sans-serif;
    }
`;
