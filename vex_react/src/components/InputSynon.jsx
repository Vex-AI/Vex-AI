import React from "react";
import "./css/InputSynon.css";
const InputSynon = ({ text, change, value }) => {
  return (
    <div className="item-input-base">
      <input
        onChange={(e) => change(e.target.value)}
        value={value}
        className="item-input"
        placeholder={text}
        type="text"
      />
    </div>
  );
};

export default InputSynon;
