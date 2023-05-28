import Avatar from "@mui/material/Avatar";
import Container from "../components/Container";
import Loader from "../components/Loader";

import { useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";

const Splash: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const color: string = "#fff";
  useEffect(() => {
    setTimeout(() => {
      navigate("/home");
    }, 50000);
  }, [navigate]);

  return (
    <Container
      style={{
        justifyContent: "center",
        padding: "3rem",
        alignItems: "center",
        flexDirection: "column",
        rowGap: "10px",
      }}
    >
      <Avatar
        src={"/Vex.png"}
        variant="square"
        sx={{
          width: 120,
          height: 120,
          borderRadius: 4,
        }}
      />
      <Loader color={color} />
    </Container>
  );
};
export default Splash;
