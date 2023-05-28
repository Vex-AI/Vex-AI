import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import Ripple from "react-ripplejs";

interface CustomStyle extends React.CSSProperties {
  rippleColor: string;
}
interface PreviewProps {
  style: CustomStyle;
  text: string;
}

const Preview: React.FC<PreviewProps> = ({ style, text }) => {
  /*  const LI: React.FC = styled(Box)({
    ...style,
    "&:hover": {
      background: style.rippleColor,
    },
  });*/
  return (
    <Box
      sx={{
        background: "#131313D1",
        zIndex: "4",
        width: "100%",
        height: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "sticky",
        top: "0",
      }}
    >
      <Ripple
        
        opacity={"0.5"}
        background={`${style.rippleColor}!important`}
        style={style}>
        <span>{text}</span>
      </Ripple>
    </Box>
  );
};

export default Preview;
