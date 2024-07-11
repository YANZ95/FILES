import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./components/App";
import HelloStyled from "./components/01/HelloStyled";
import Nesting from "./components/02/Nesting";
import { Practice as Practice1 } from "./components/03/Practice";
// import { Practice as Practice2 } from "./components/04/Practice";
function Main(props) {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="01" element={<HelloStyled />} />
            <Route path="02" element={<Nesting />} />
            <Route path="03" element={<Practice1 />} />
            {/* <Route path="04" element={<pracice2 />} /> */}
            {/*     <Route path="05" element={} /> */}
            {/*     <Route path="06" element={} /> */}
            {/*     <Route path="07" element={} /> */}
            {/*     <Route path="08" element={} /> */}
            {/*     <Route path="09" element={} /> */}
            {/*     <Route path="10" element={} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Main;
