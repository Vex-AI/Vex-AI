/* Imports */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Browser, Route, Routes } from "react-router-dom";
import Synons from "./components/Synons"
/* Components */
import Home from "./components/Home";
import Splash from "./components/Splash";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Browser>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="home" element={<Home />} />
        <Route path="synons" element={<Synons/>} />
      </Routes>
    </Browser>
  </React.StrictMode>
);
