import "./css/TypeBar.css";

const TypeBar = ({ open }) => {
  
  return (
    <div
      id="type"
      style={{
        animation:
          open === true ? "typeOn 0.4s forwards" : "typeOff 0.4s forwards",
      }}
    >
      Vex is typing  {open.toString()}
    </div>
  );
};

export default TypeBar;
