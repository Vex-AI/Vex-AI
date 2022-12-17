import "./css/TypeBar.css";

const TypeBar = ({ open }) => {
  return (
    <div
      id="type"
      style={{
        animation: open ? "typeOn 1s forwards" : "typeOff 1s forwards",
      }}
    >
      Vex is typing
    </div>
  );
};

export default TypeBar;
