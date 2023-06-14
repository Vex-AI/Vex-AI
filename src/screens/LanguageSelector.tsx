import { useTranslation } from "react-i18next";
import Container from "../components/Container";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
  createTheme,
  IconButton,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useNavigate, NavigateFunction } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";

const LanguageSelector: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();

  const handleChangeLanguage = (selectedLanguage: string) => {
    changeLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#ffffff",
      },
      secondary: {
        main: "#e0e0e0",
      },
    },
  });

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      bgcolor="#212121"
      minHeight="100vh"
      p={2}
      color="white"
    >
      <Box
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          minHeight: "0px",
          width:"100%",
          height: "50px",
          backgroundColor: "transparent",
          position: "fixed",
          top: 0,
          margin: "1rem 0 1rem 0",
        }}
      >
        <IconButton
          onClick={() => navigate("/home")}
          color="primary"
          style={{ padding: "1rem" }}
          aria-label="Adicionar"
        >
          <ClearIcon
            style={{
              fill: "white",
              padding: "5px",
              width: "50px",
              height: "50px",
            }}
            aria-label="back button"
          />
        </IconButton>
      </Box>
      <Typography variant="h6" style={{ marginBottom: "10px" }}>
        {t("select")}
      </Typography>
      <LanguageIcon fontSize="large" style={{ marginBottom: "10px" }} />
      <List style={{ width: "50%" }}>
        <ThemeProvider theme={theme}>
          <ListItem
            button
            selected={language === "enUS"}
            onClick={() => handleChangeLanguage("enUS")}
          >
            <ListItemText primary={t("english")} />
          </ListItem>
          <ListItem
            button
            selected={language === "ptBR"}
            onClick={() => handleChangeLanguage("ptBR")}
          >
            <ListItemText primary={t("portuguese")} />
          </ListItem>
        </ThemeProvider>
      </List>
    </Box>
  );
};

export default LanguageSelector;
