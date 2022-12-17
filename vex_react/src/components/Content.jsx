import React from "react";
import "./css/Content.css";

const Content = ({ children, style }) => {
  
  return (
    <div id="content" style={style}>
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
