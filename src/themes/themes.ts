import { createTheme } from "@mui/material/styles";

export const whiteTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            color: "white",
            // text color
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
            // border color
          },
          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
            // border color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "white",
              // border color on focus
            },
          "& .MuiInputLabel-root": {
            color: "white",
            // placeholder color
          },
          "&.Mui-focused .MuiInputLabel-root": {
            color: "white",
            // placeholder color on focus
          },
        },
      },
      defaultProps: {
        variant: "outlined",
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#fff",
    },
  },
});
interface IModalStyles {
  overlay: React.CSSProperties;
  content: React.CSSProperties;
}

export const wordsModalStyle: IModalStyles = {
  overlay: {
    zIndex: 2000,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    boxSizing: "border-box",
  },
  content: {
    overflow: "hidden",
    boxSizing: "border-box",
    padding: "1.4rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(49, 50, 109, 0.91)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    maxWidth: "500px",
    margin: "0 auto",
  },
};

export const profileModalStyle: IModalStyles = {
  content: {
    backgroundColor: "black",
    color: "white",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    height: "fit-content",
    margin: "auto",
  },

  overlay: {
    background: "rgba(66, 68, 90, 0.8)",
  },
};
