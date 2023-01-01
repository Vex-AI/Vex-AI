/* Imports */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Browser, Route, Routes } from "react-router-dom";
import Synons from "./components/Synons";

/* Components */
import Home from "./components/Home";
import Splash from "./components/Splash";
import { Helmet } from "react-helmet";
import Customize from "./components/Customize"
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  //<React.StrictMode>
  <>
  <Helmet>
  <meta property="og:title" content="Vex is an AI to talk to anyone, including lonely people."/>
  <meta property="og:description" content="This is an AI that I have been building since 2019 with the aim of creating an AI capable of having a normal conversation with a person and talk about games and various subjects... and who knows... become a conscious AI(⊙_⊙)"/>
  meta property="og:site_name" content="Vex aI"/>
  <meta property="og:image" content={process.env.PUBLIC_URL+"/vex.ico"}/>
  <meta property="og:image:type" content="image/png"/>
  <meta property="og:type" content="website"/>
  <title>Vex AI</title>
  </Helmet>
    <Browser>
      <Routes>
        <Route path="*" element={<Splash />} />
        <Route path="home" element={<Home />} />
        <Route path="synons" element={<Synons />} />
        <Route path="custom" element={<Customize/>} />
      </Routes>
    </Browser>
    </>
 // </React.StrictMode>
);
