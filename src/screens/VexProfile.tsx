import { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../store/";
import Modal from "react-modal";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { GitHub, YouTube, Edit } from "@mui/icons-material";
import { setVexName, setProfileImage } from "../store/reducers/vexReducer";
import Footer from "../components/Footer";
import { styled } from "@mui/system";

const CancelButton = styled(IconButton)({
  color: "#fff",
  margin: "1rem",
  backgroundColor: "#FF0060C4",
  borderRadius: "10px",
  padding: "1rem",
  "&:hover": {
    backgroundColor: "#3f3f3f",
  },
});
import { useNavigate, NavigateFunction } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { profileModalStyle } from "../themes/themes";
const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#fff",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
          "& .MuiOutlinedInput-input": {
            color: "white",
          },
          "& .MuiInputLabel-root": {
            color: "white",
          },
        },
      },
    },
  },
});

Modal.setAppElement("#root");

const ProfileComponent = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const vexName = useSelector((state: RootState) => state.vex.vexName);

  const GoBack = styled(IconButton)({
    alignItems: "flex-start",
    justifyContent: "center",
    height: "50px",
    backgroundColor: "transparent",
    margin: "1rem 0 1rem 0",
    color: "white",
    display: "flex",
    flexDirection: "row",
  });

  const navigate: NavigateFunction = useNavigate();

  const profileImage = useSelector(
    (state: RootState) => state.vex.profileImage
  );

  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);

  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);

  const [newName, setNewName] = useState("");

  const handleEditName = useCallback(() => {
    setIsEditNameModalOpen(true);
  }, []);

  const handleCancelEditName = useCallback(() => {
    setIsEditNameModalOpen(false);
    setNewName("");
  }, []);

  const handleSaveName = useCallback(() => {
    dispatch(
      setVexName({
        vexName: newName,
      })
    );
    setNewName("");
    setIsEditNameModalOpen(false);
  }, [newName]);

  const handleSelectImage = useCallback(
  (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = event.target.files?.[0];

    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageContent: string = e.target?.result?.toString() ?? "";

        dispatch(setProfileImage({ imageContent }));
      };
      reader.readAsDataURL(file);
    }

    setIsEditImageModalOpen(false);
  },
  [dispatch]
);


  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <GoBack onClick={() => navigate("/home")}>
          <ClearIcon
            style={{
              fill: "white",
              padding: "5px",
              width: "50px",
              height: "50px",
            }}
            aria-label={t("back_button") as string}
          />
        </GoBack>
        <Box width="fit-content" position="relative">
          <Avatar
            alt="Profile Image"
            src={profileImage}
            sx={{
              width: 150,
              height: 150,
              borderRadius: "15px",
              margin: "auto",
            }}
          />
          <IconButton
            onClick={() => setIsEditImageModalOpen(true)}
            aria-label="Edit Image"
            sx={{
              position: "absolute",
              bottom: -15,
              right: -15,
              backgroundColor: "white",
              color: "black",
            }}
          >
            <Edit />
          </IconButton>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop={"2rem"}
        >
          <Typography variant="h4">{vexName}</Typography>
          <IconButton
            onClick={handleEditName}
            aria-label="Edit Name"
            sx={{ color: "white", marginLeft: 1 }}
          >
            <Edit />
          </IconButton>
        </Box>

        <Box textAlign="center" marginBottom={2} marginTop={2}>
          <IconButton
            component="a"
            href="https://github.com/Vex-AI/VexAI"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            sx={{ color: "white", marginRight: 1, marginTop: 1 }}
          >
            <GitHub fontSize="large" />
          </IconButton>
          <IconButton
            component="a"
            href="https://youtube.com/@vex-ai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            sx={{ color: "white", marginRight: 1, marginTop: 1 }}
          >
            <YouTube fontSize="large" />
          </IconButton>
        </Box>
        <Footer />
        <Modal isOpen={isEditNameModalOpen} style={profileModalStyle}>
          <TextField
            label="Edit Name"
            value={newName}
            inputProps={{ maxLength: 12 }}
            onChange={(e) => setNewName(e.target.value)}
            color="primary"
          />

          <Button
            variant="outlined"
            color="primary"
            onClick={handleSaveName}
            sx={{ margin: "1rem 0" }}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={handleCancelEditName}>
            Cancel
          </Button>
        </Modal>

        <Modal isOpen={isEditImageModalOpen} style={profileModalStyle}>
          <input type="file" accept="image/*" onChange={handleSelectImage} />
          <CancelButton
            color="primary"
            style={{ padding: "5px 10px" }}
            aria-label={t("cancel_button") as string}
            onClick={() => setIsEditImageModalOpen(false)}
          >
            <p style={{ fontSize: "1rem" }}>{t("cancel")}</p>
          </CancelButton>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default ProfileComponent;
