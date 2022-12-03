import "./css/ProfileBar.css";
import React from "react";
const ProfileBar = ({ children }) => {
  return (
    <>
    <div id="toolbar">
    <img
    alt="a pink face (emoticon) with an angry face "
    className="image"
    src="https://github.com/cookieukw/Vex-Reactions/blob/main/reactions/vex_angry.png?raw=true"
    />
    
    <p id="name">{children}</p>
    <span className="status"></span>
    </div>
    </>
    );
};
export default ProfileBar;
