import React from "react";
import "./css/Icon.css";
const Icon = ({ fileName, url, alt, onClick   ,style}) => {
  return (
    <img
    style={style}
      alt={alt}
      onClick={onClick}
      className="icon"
      src={fileName? process.env.PUBLIC_URL + "/icons/" + fileName : url}
    />
  );
};

export default Icon;
