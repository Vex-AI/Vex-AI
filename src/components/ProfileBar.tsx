import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { RootState } from "../store/";
import { styled } from "@mui/system";
import { connect } from "react-redux";
const StatusIndicator = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  marginRight: "1rem",
  backgroundColor: "green",
  "@media screen and (max-width: 416px)": {
    width: "30px",
    height: "30px",
  },
}));

const VexName = styled(Typography)(({ theme }) => ({
  fontSize: "22px",
  color: "black",
  fontWeight: "bold",
  fontFamily: "Source Sans Pro, sans-serif",
  "@media screen and (max-width: 400px)": {
    fontSize: "6vw",
  },
}));

interface ProfileBarProps {
  vexName: string;
  profileImage: string;
}
const ProfileBar: React.FC<ProfileBarProps> = ({ vexName, profileImage }) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        flexGrow: 0,
        padding: "10px",
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
        zIndex: "2",
        "@media (min-width: 400px)": {
          width: "300px",
        },
      }}
    >
      <Avatar
        src={profileImage}
        variant="square"
        sx={{ width: 50, height: 50, borderRadius: 4 }}
      />
      <VexName variant="h3">{vexName}</VexName>
      <StatusIndicator />
    </Box>
  );
};
export default connect((state: RootState) => ({
  profileImage: state.vex.profileImage,
}))(ProfileBar);
