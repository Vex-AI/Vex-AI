import { SwipeableDrawer, Divider, List } from "@mui/material";
import { useState } from "react";

const Drawer: React.FC = () => {
  const [drawer, setDrawer] = useState<boolean>(false);
  
  const toggleDrawer:()=>void= ()=>{
    setDrawer(!drawer)
  }
  return (
    <SwipeableDrawer
      variant={"temporary"}
      anchor={"right"}
      open={drawer}
      onClose={() => toggleDrawer()}
      onOpen={() => toggleDrawer()}
    >
      <List sx={{ width: "100%", bgcolor: "black" }}>
        test
        <Divider />
        test
      </List>
    </SwipeableDrawer>
  );
};
export default Drawer;
