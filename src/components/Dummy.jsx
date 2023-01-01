import { forwardRef } from "react";
import "./css/Dummy.css";
const Dummy = ({refer}) => {
  return (
    <div
      ref={refer}
      className="dummy"
      style={{
        marginTop: "0",
        clear: "both",
      }}
    ></div>
  );
};
export default forwardRef(Dummy);
