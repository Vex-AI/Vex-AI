import React, { useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Container from "../components/Container";
import Loader from "../components/Loader";

const Splash: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();


  useEffect(() => {
    const selectedLanguage: string | null =
      localStorage.getItem("language");

    setTimeout(() => {
      if (selectedLanguage) return navigate("/home");
      navigate("/language");
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
      <Loader color="#fff" />
    </Container>
  );
};

export default Splash;
