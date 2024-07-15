import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import MainPage from "./pages/MainPage";
import AboutPage from "./pages/AboutPage";
import { GlobalStyle } from "./theme/GlobalStyle";
import { ThemeChangeProvider } from "./context/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      {/*  <BrowserRouter> 제일 먼저 해야 될 일 */}
      <ThemeChangeProvider>
        <GlobalStyle />
        <Routes>
          {/* 인터넷 찾아볼 때 버전 확인하지 않으면 오류가 남 */}
          {/* 어디가든 윗 창은 안 바뀌고 고정이 되어있음 */}
          {/* nav-bar 만드는 방법  */}
          <Route path="/" element={<Home />}>
            <Route path="" element={<MainPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </ThemeChangeProvider>
    </BrowserRouter>
  );
}

export default App;
