import React from "react";
import "./css/Button.css";
const Button = ({ text, color, onClick }) => {
  if (!color) color = "#fff";
  return (
    <button onClick={onClick} className={`button ${color}`}>
      {text}
    </button>
  );
};

export default Button;
