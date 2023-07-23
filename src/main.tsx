import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Browser, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import Customize from "./screens/Customize";
import Drawer from "./components/Drawer";
import LanguageSelector from "./screens/LanguageSelector";
import Train from "./screens/Train";
import Synon from "./screens/Synon";
import VexProfile from "./screens/VexProfile";
import Splash from "./screens/Splash";
import "./classes/translation";
import { Provider } from "react-redux";

import store from "./store/index";
/*
(() => {
  if (!import.meta.env.VITE_ERUDA) return;
  const script = document.createElement("script");
  script.src = "//cdn.jsdelivr.net/npm/eruda";
  script.onload = function () {
    eruda.init();
  };
  document.body.appendChild(script);
})();
*/
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(

    <Browser>
      <Provider store={store}>
        <Drawer />
        <Routes>
          <Route path="*" element={<Splash />} />
          <Route path="home" element={<Home />} />
          <Route path="home/:locale" element={<Home />} />
          <Route path="synon" element={<Synon />} />
          <Route path="train" element={<Train />} />
          <Route path="custom" element={<Customize />} />
          <Route path="language" element={<LanguageSelector />} />
          <Route path="profile" element={<VexProfile />} />
        </Routes>
      </Provider>
    </Browser>

);
