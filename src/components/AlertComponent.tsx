import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconButton, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface AlertComponentProps {
  message: string;
  keyName?: string;
  backgroundColor?:string
}

const AlertComponent: React.FC<AlertComponentProps> = ({
  message = "Empty warning",
  keyName = "09iApZFlAx4m",
  backgroundColor="#f44336"
}) => {
  const [openAlerts, setOpenAlerts] = useState<boolean>(
    localStorage.getItem(keyName) ? false : true
  );

  const handleClose = () => {
    setOpenAlerts(false);
    localStorage.setItem(keyName, "false");
  };
  if (!openAlerts) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      style={{
        padding: 30,
        backgroundColor,
        color: "#fff",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        margin: 20,
      }}
    >
      <Typography variant="body1" style={{ marginRight: "10px" }}>
        {message}
      </Typography>
      <IconButton
        size="small"
        aria-label="Fechar"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </motion.div>
  );
};

export default AlertComponent;
