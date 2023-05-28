import Box from "@mui/material/Box";
import { ReactNode } from "react";
import { whiteTheme } from "../themes/themes";
import { ThemeProvider } from "@mui/material/styles";
import { SxProps } from "@mui/system";

interface InputProps {
  children?: ReactNode;
  sx?: SxProps;
}

const Input: React.FC<InputProps> = ({ children, sx = {} }) => {
  return (
    <ThemeProvider theme={whiteTheme}>
      <Box
        sx={{
          borderRadius: 4,
          width: "90%",
          bgcolor: "var(--bg-buttons-color)",
          p: 2,
          position: "sticky",
          bottom: "10px",
          zIndex: 3,
          height: "auto",
          display: "flex",
          padding: ".5rem .8rem .5rem .8rem",
          ...sx,
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default Input;
