import { connect } from "react-redux";
import { memo } from "react";
import styles from "./css/TypeBar.module.css";
interface RootState {
  vex: {
    isTyping: boolean;
    vexName: string;
  };
}

interface TypeBarProps {
  isTyping: boolean;
  vexName: string;
}

const TypeBar: React.FC<TypeBarProps> = ({ isTyping, vexName }) => {
  return (
    <div
      className={styles.typebar}
      style={{
        animation: isTyping ? "typeOn 1s forwards" : "typeOff 1s forwards",
        background: "var(--bg-input-color)",
        marginLeft: "2rem",
        marginRight: "2rem",
        zIndex: 2,
        borderRadius: "10px 10px 0 0",
        padding: ".7rem",
        color: "white",
        fontSize: "1rem",
        position: "fixed",
        bottom: "40px",
      }}
    >
      {vexName} is typing
    </div>
  );
};

export default memo(
  connect((state: RootState) => ({
    isTyping: state.vex.isTyping,
    vexName: state.vex.vexName,
  }))(TypeBar)
);
