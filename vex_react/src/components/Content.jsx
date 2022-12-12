import React from "react";
import "./css/Content.css";

const Content = ({ children, styles }) => {
  
  return (
    <div id="content" styles={styles}>
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
