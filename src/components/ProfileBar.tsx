import styles from "./css/ProfileBar.module.css";
import React from "react";
import Avatar from "@mui/material/Avatar";

interface ProfileBarProps {
  vexName: string;
}

const ProfileBar: React.FC<ProfileBarProps> = ({ vexName }) => {
  return (
    <div id={styles.toolbar}>
      <Avatar
        src={"/Vex.png"}
        variant="square"
        sx={{ width: 50, height: 50, borderRadius: 4 }}
      />
      <p id={styles.vex_name}>{vexName}</p>
      <span className={styles.status}></span>
    </div>
  );
};
export default ProfileBar;
