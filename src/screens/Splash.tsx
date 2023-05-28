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
    }, 1200);
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
        src={"/Vex_320.png"}
        variant="square"
        sx={{
          width: 120,
          height: 120,
          borderRadius: 4,
        }}
      />
      <div>
      <Loader color={color} />
      </div>
    </Container>
  );
};
export default Splash;
