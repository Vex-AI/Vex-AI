import { forwardRef } from "react";
import "./css/Dummy.css";
const Dummy = ({}, ref) => {
  return (
    <div
      ref={ref}
      className="dummy"
      style={{
        marginTop: "0",
        clear: "both",
      }}
    ></div>
  );
};
export default forwardRef(Dummy);
