import './css/ProfileBar.css';
import React from 'react';
const ProfileBar = ({children})=> {
  return (
    <>
      <div id="toolbar">
      <img
      className="image"
      src="https://github.com/cookieukw/Vex-Reactions/blob/main/reactions/vex_angry.png?raw=true"/>
      <p id="name">teste</p>
    <span className="status"></span>
    </div>
    </>
  );
}
export default ProfileBar;
