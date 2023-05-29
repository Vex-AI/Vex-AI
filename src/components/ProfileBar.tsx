import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/system";

const StatusIndicator = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: "5vw",
  height: "5vw",
  marginRight: "1rem",
  backgroundColor: "green",
  "@media screen and (max-width: 768px)": {
    width: "1.4rem",
    height: "1.4rem",
  },
}));

const VexName = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontFamily: "Source Sans Pro, sans-serif",
  "@media screen and (max-width: 768px)": {
    fontSize: "1.5rem",
  },
}));

const ProfileBar: React.FC<ProfileBarProps> = ({ vexName }) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        flexGrow: 0,
        padding: "2vw",
        marginLeft: "2vw",
        marginRight: "2vw",
        top: "1vh",
        position: "fixed",
        margin: "auto",
        width: "90%",
        height: "auto",
        backgroundColor: "#ffffff",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    >
      <Avatar
        src={"/Vex.png"}
        variant="square"
        sx={{ width: 50, height: 50, borderRadius: 4 }}
      />
      <VexName variant="h3">{vexName}</VexName>
      <StatusIndicator />
    </Box>
  );
};

export default ProfileBar;
