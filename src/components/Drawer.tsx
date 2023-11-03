import {
  SwipeableDrawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  createTheme,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import { RootState } from "../store/";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useState } from "react";
import { Brush, Delete, School, Person, Home, Menu } from "@mui/icons-material";
import { styled } from "@mui/system";
import { Dispatch } from "redux";
import { dropAllMessage } from "../store/reducers/vexReducer";
import { useNavigate, NavigateFunction } from "react-router-dom";
import styles from "./css/Drawer.module.css";

interface IDrawerProps {
  dispatch: Dispatch;
}

const DItem = styled(ListItem)({
  display: "flex",
  gap: "1rem",
  padding: "1.5rem 2rem",
  boxSizing: "border-box",
  width: "100%",
  cursor: "pointer",
  borderRadius: "10px 0 10px 10px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  margin: "8px",
  marginRight: 0,
  transition: "background-color 0.3s ease",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    width: "0",
    height: "100%",
    background: "rgba(255, 255, 255, 0.2)",
    transition: "width 0.3s ease",
    transform: "translateX(-50%)",
  },
  "&:hover:before": {
    borderRadius: "10px 0 10px 10px",
    width: "100%",
  },
});

const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#1e222b",
          width: "300px",
        },
      },
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#131721",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

const Drawer: React.FC<IDrawerProps> = ({ dispatch }) => {
  const [drawer, setDrawer] = useState<boolean>(false);
  const { t } = useTranslation();

  const toggleDrawer = () => {
    setDrawer(!drawer);
  };

  const navigate: NavigateFunction = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <IconButton
        className={styles.drawerButton}
        onClick={() => {
          toggleDrawer();
        }}
        style={{
          zIndex: "2",
          width: "50px",
          height: "50px",
          position: "fixed",
          top: 10,
          color: "white",
          left: "20vw",
          cursor: "pointer",
          borderRadius: 10,
        }}
      >
        <Menu />
      </IconButton>
      <SwipeableDrawer
        variant="temporary"
        anchor="left"
        open={drawer}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        <List>
          <DItem onClick={() => navigate("custom")}>
            <Brush />
            {t("customization")}
          </DItem>
          <Divider />
          <DItem
            onClick={() => {
              dispatch(dropAllMessage);
            }}
          >
            <Delete />
            {t("clearChat")}
          </DItem>
          <Divider />
          <DItem onClick={() => navigate("profile")}>
            <Person />
            {t("vexProfile")}
          </DItem>
          <Divider />
          <DItem onClick={() => navigate("/train")}>
            <School />
            {t("functions")}
          </DItem>
          <Divider />
          <DItem onClick={() => navigate("/home")}>
            <Home />
            {t("home")}
          </DItem>
        </List>
      </SwipeableDrawer>
    </ThemeProvider>
  );
};

export default connect((state) => state)(Drawer);
