/* Components */
import React, { useState } from "react";
import { Slider, Checkbox, FormControlLabel, Button } from "@mui/material";
import Content from "./Content";
import Preview from "./Preview";
import TextView from "./TextView";
import { HexColorPicker, RgbaColorPicker } from "react-colorful";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Imports */
import { createTheme } from "@mui/material/styles";
import { red, green } from "@mui/material/colors";

/**/
const Customize = () => {
  const [key, setKey] = useState("vexStyle");

 // const { log } = console;
  const style = localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key))
    : {};

  const [borderTopRightRadius, setborderTopRightRadius] = useState(
    style.borderTopRightRadius || 10
  );
  const [borderTopLeftRadius, setborderTopLeftRadius] = useState(
    style.borderTopLeftRadius || 10
  );
  const [borderBottomRightRadius, setborderBottomRightRadius] = useState(
    style.borderBottomRightRadius || 10
  );
  const [borderBottomLeftRadius, setborderBottomLeftRadius] = useState(
    style.borderBottomLeftRadius || 10
  );
  const [borderColor, setBorderColor] = useState(style.borderColor || "#fff");
  const [borderWith, setBorderWith] = useState(style.borderWith || 2);
  const [backgroundColor, setBackgroundColor] = useState(
    style.backgroundgColor || "rgba(220, 17, 47, 0.9)"
  );
  const [textColor, setTextColor] = useState(style.textColor || "#fff");
  
  const darkTheme = createTheme({
    palette: {
      primary: red,
      mode: "dark",
    },
  });

  const updateStyles = () => {
    setKey(key !== "vexStyle" ? "vexStyle" : "userStyle");
  };

  return (
    <Content
      style={{
        justifyContent: "flex-start",
        padding: "1rem 2rem 1rem 2rem",
      }}
    >
      <ToastContainer />
      <Preview
        text={key === "vexStyle" ? "Hello, i am Vex" : "My message :)"}
        style={{
          ...style,
          borderTopLeftRadius: borderTopLeftRadius + "px",
          borderTopRightRadius: borderTopRightRadius + "px",
          borderBottomRightRadius: borderBottomRightRadius + "px",
          borderBottomLeftRadius: borderBottomLeftRadius + "px",
          borderWith: borderWith + "px",
          backgroundColor,
          color: textColor,
          borderColor,
          padding: "1rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
          margin: "0 0 3rem 0",
          borderStyle: "solid",
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={key === "vexStyle"}
            onChange={() => {
              updateStyles();
            }}
          />
        }
        style={{
          color: "#00e676",
        }}
        sx={{
          color: "white",
          "&.Mui-checked": {
            color: "white",
          },
        }}
        label={key === "vexStyle" ? "Is Vex message" : "Is your message"}
      />
      <TextView text={" Top-Left"} />
      <Slider
        theme={darkTheme}
        defaultValue={10}
        max={30}
        aria-label="Default"
        valueLabelDisplay="on"
        onChange={(e, value) => {
          setborderTopLeftRadius(value);
        }}
      />
      <TextView text={" Top-Right"} />
      <Slider
        theme={darkTheme}
        defaultValue={10}
        max={30}
        aria-label="Default"
        valueLabelDisplay="on"
        onChange={(e, value) => {
          setborderTopRightRadius(value);
        }}
      />
      <TextView text={" Bottom-Left"} />
      <Slider
        theme={darkTheme}
        defaultValue={10}
        max={30}
        aria-label="Default"
        valueLabelDisplay="on"
        onChange={(e, value) => {
          setborderBottomLeftRadius(value);
        }}
      />
      <TextView text={" Bottom-Right"} />
      <Slider
        theme={darkTheme}
        defaultValue={10}
        max={30}
        aria-label="Default"
        valueLabelDisplay="on"
        onChange={(e, value) => {
          setborderBottomRightRadius(value);
        }}
      />
      <TextView text={"Message color"} />
      <RgbaColorPicker
        onChange={(color) =>
          setBackgroundColor(
            `rgba(${color.r},${color.g},${color.b},${color.a ? color.a : 1})`
          )
        }
      />
      <TextView text={"Text color"} />
      <HexColorPicker color={textColor} onChange={setTextColor} />
      <TextView text={"Stroke"} />
      <Slider
        theme={darkTheme}
        defaultValue={2}
        max={6}
        aria-label="Default"
        valueLabelDisplay="on"
        onChange={(e, value) => {
          setBorderWith(value);
        }}
      />
      <HexColorPicker color={borderColor} onChange={setBorderColor} />
      <Button
        variant="outlined"
        style={{marginTop:"1rem"}}
        theme={createTheme({
          palette: {
            primary: {
              main: green[200],
              darker: "#053e85",
            },
            neutral: {
              main: "#64748B",
              contrastText: "#fff",
            },
          },
        })}
        onClick={() => {
          localStorage.setItem(
            key,
            JSON.stringify({
              ...style,
              borderTopLeftRadius,
              borderTopRightRadius,
              borderBottomRightRadius,
              borderBottomLeftRadius,
              borderWith,
              backgroundColor,
              color: textColor,
              borderColor,
              padding: "1rem",
              paddingLeft: "2.5rem",
              paddingRight: "2.5rem",
              margin: "0 0 3rem 0",
              borderStyle: "solid",
            })
          );
          toast(`Saved ${key} with sucess!`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }}
      >
        Save styles
      </Button>
    </Content>
  );
};

export default Customize;
