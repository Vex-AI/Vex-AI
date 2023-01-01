import React from "react";
import "./css/ItemDrawer.css";
import { ListItem } from "@mui/material";
const ItemDrawer = ({ Icon, children, onClick }) => {
  return (
    <ListItem 
    onClick={onClick} secondaryAction={Icon ? <Icon /> : ""}>
      {children}
    </ListItem>
  );
};

export default ItemDrawer;