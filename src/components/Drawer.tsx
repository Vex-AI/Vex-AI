import {
  SwipeableDrawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { RootState } from "../store/";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useState } from "react";
import { Brush, Delete, School, Person, Home } from "@mui/icons-material";
import { styled } from "@mui/system";
import { Dispatch } from "redux";
import { dropAllMessage } from "../store/reducers/vexReducer";
import { useNavigate, NavigateFunction } from "react-router-dom";

interface IDrawerProps {
  dispatch: Dispatch;
}

const DItem = styled(ListItem)({
  display: "flex",
  gap: "1rem",
  padding: "1.5rem 2rem",
});

const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#1e222b",
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
