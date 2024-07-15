import { createContext, useContext, useState } from "react";
import { darkTheme, lightTheme } from "../theme/theme";
import { ThemeProvider as StyledProvider } from "styled-components";
// 컴포넌트에서 제공을 한다. 컴포넌트 한개가 알아서 만들어준다. 얘한테는 Theme
// 이라는 prov으로 전달된다.
import { theme } from "./../theme/theme";

const ThemeContext = createContext();
// 전역적인 공간, 전역공간을 만들어낸다.

function ThemeChangeProvider({ children }) {
  // 여기서 리턴해주는 jsx
  // 일몰시간 불러오는 API
  //   결과값을 가지고 조건문으로 light나 dark
  const localTheme = localStorage.getItem("theme") || "light";
  const [themeMode, setThemeMode] = useState(localTheme);
  // 많이 어려움. 흐름 잘 파악해야 함
  const themeObject = themeMode === "light" ? lightTheme : darkTheme;
  //   이거 원래는 어케 써야되냐면 e.c.t에서 꺼내써야 됨
  // 관리할 때 편해서 이렇게 씀
  // 라이트댐 치면 2번 아니면 darkTheme

  return (
    // JSX 만듬, 프로바이더 만듬
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      {/* value={{}} 밸류로 전달하는 거 전달해야됨 테마모드 변경할거고, 변경할 테마 변경해주는 함수도 필요해서 value 넣어줌 */}
      <StyledProvider theme={themeObject}>{children}</StyledProvider>
    </ThemeContext.Provider>
    // 하나로 프로바이더로 감싸기 위해서 app.js에 만들고 앱 파일에서도 감싸줌
    // {children}가 app.jsㅇ[] <ThemeChangeProvider> 안으로 들어감.
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  const { themeMode, setThemeMode } = context;
  // 얘네 밸류에서 그대로 넘어옴. 얘네 구조분해해서 뽑는다는 뜻

  const toggleTheme = () => {
    if (themeMode === "light") {
      setThemeMode("dark");
    } else {
      setThemeMode("light");
      // 왜 이 함수를 여기에 썻을까?
    }
  };
  return [themeMode, toggleTheme];
  //   만약에 이거를 여기에 안 쓰면 버튼에 써야됨. 거기에 쓰이면
  // 전역적으로 쓰이지 않는다.
}

export { ThemeChangeProvider, useTheme };
// 자동완성이 안되면 export 확인해야됨
