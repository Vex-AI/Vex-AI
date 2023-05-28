import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { BrowserRouter as Browser, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import Customize from "./screens/Customize";
import Synon from "./screens/Synon";
import Splash from "./screens/Splash";
import { Provider } from "react-redux";
import store from "./store/index";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Browser>
      <Provider store={store}>
        <Routes>
          <Route path="*" element={<Splash />} />
          <Route path="home" element={<Home />} />
          <Route path="synon" element={<Synon />} />
          <Route path="custom" element={<Customize />} />
        </Routes>
      </Provider>
    </Browser>
  </React.StrictMode>
);
