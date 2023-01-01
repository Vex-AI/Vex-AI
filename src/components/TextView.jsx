import "./css/TextView.css"
const TextView = ({ text, style }) => {
  return <p className={"TextView"} style={style}>{text}</p>;
};

export default TextView;
