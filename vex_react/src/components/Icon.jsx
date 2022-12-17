import React from "react";
import "./css/Icon.css";
const Icon = ({ fileName, alt, onClick }) => {
  return (
    <img
      alt={alt}
      onClick={onClick}
      className="icon"
      src={process.env.PUBLIC_URL + "/icons/" + fileName}
    />
  );
};

export default Icon;
