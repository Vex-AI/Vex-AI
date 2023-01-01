import React from "react";

const Preview = ({ style, text }) => {
  return (
    <div
      style={{
        backgroundColor: "rbga(0,0,0,0.81)",
        borderRadius: "10px",
        padding: "4px",
        position: "sticky",
        top: "1rem",
        height: "min-content",
        zIndex: "3",
      }}
    >
      <div style={style}>{text}</div>
    </div>
  );
};

export default Preview;
