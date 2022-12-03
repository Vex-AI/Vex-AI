import React from "react";
import "./css/Content.css";

const Content = ({ children }) => {
  return (
    <div id="content">
      {children}
      <div id="bg">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div>
    </div>
  );
};

export default Content;
