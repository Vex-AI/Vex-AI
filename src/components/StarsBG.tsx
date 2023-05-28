import styles from "./css/StarsBG.module.css";
import { CSSProperties } from "react";

interface StarsBGProps {
  style?: CSSProperties;
}

const StarsBG: React.FC<StarsBGProps> = ({ style }) => {
  return (
    <div id={styles.bg}>
      <div id={styles.stars}></div>
      <div id={styles.stars2}></div>
      <div id={styles.stars3}></div>
    </div>
  );
};

export default StarsBG;
