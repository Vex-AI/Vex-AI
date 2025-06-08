import styles from "./css/StarsBG.module.css";
import { CSSProperties } from "react";

interface StarsBGProps {
  style?: CSSProperties;
}

const StarsBG: React.FC<StarsBGProps> = () => {
  return (
    <div id={styles.bg}>
      <img id={styles.wallpaper} />
      <div style={{ zIndex: "4" }}>
        <div id={styles.stars}></div>
        <div id={styles.stars2}></div>
        <div id={styles.stars3}></div>
      </div>
    </div>
  );
};

export default StarsBG;
