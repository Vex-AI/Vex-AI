import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import StarsBG from "../components/StarsBG";
import { useNavigate, NavigateFunction } from "react-router-dom";
import {
  Slider as SliderComponent,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Typography,
  ButtonBase,
  IconButton,
} from "@mui/material";
import utils from "../classes/utils";
import { ChromePicker } from "react-color";
import MessageItem from "../components/MessageItem";
import Preview from "../components/Preview";
import Container from "../components/Container";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";
import { red, green } from "@mui/material/colors";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import ClearIcon from "@mui/icons-material/Clear";

const Text = styled(Typography)({
  fontWeight: "bold",
  flexGrow: 1,
  color: "white",
  margin: "1rem 0 1rem 0",
});

const Slider = styled(SliderComponent)({
  width: "200px",
  boxSizing: "border-box",
  color: "red",
  margin: "1rem",
  padding: "1rem",
});

interface Style {
  borderTopRightRadius: number;
  borderTopLeftRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  borderColor: string;
  borderWidth: number;
  backgroundColor: string;
  textColor: string;
  rippleColor: string;
}

const Customize: React.FC = () => {
  const [key, setKey] = useState<string>("vexStyle");
  console.log(0);
  const { t } = useTranslation();
  const style: Style = useMemo(() => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key) as string)
      : {
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
          backgroundColor: "rgba(220, 17, 47, 0.9)",
          textColor: "#fff",
          rippleColor: "#000",
        };
  }, [key]);

  const [borderTopRightRadius, setBorderTopRightRadius] = useState<number>(
    () => style.borderTopRightRadius
  );
  const [borderTopLeftRadius, setBorderTopLeftRadius] = useState<number>(
    () => style.borderTopLeftRadius
  );
  const [borderBottomRightRadius, setBorderBottomRightRadius] =
    useState<number>(() => style.borderBottomRightRadius);
  const [borderBottomLeftRadius, setBorderBottomLeftRadius] = useState<number>(
    () => style.borderBottomLeftRadius
  );
  const [borderColor, setBorderColor] = useState<string>(
    () => style.borderColor
  );
  const [borderWidth, setBorderWidth] = useState<number>(
    () => style.borderWidth
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    () => style.backgroundColor
  );
  const [textColor, setTextColor] = useState<string>(() => style.textColor);
  const [rippleColor, setRippleColor] = useState<string>(
    () => style.rippleColor
  );

  const darkTheme: Theme = createTheme({
    palette: {
      primary: red,
      mode: "dark",
    },
  });

  const updateStyles = useCallback((): void => {
    setKey((prevKey) => (prevKey !== "vexStyle" ? "vexStyle" : "userStyle"));
  }, []);
  const navigate: NavigateFunction = useNavigate();

  const GoBack = styled(IconButton)({
    alignItems: "flex-start",
    justifyContent: "center",
    minHeight: "0px",
    height: "50px",
    backgroundColor: "transparent",
    margin: "1rem 0 1rem 0",
    color: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  });

  const saveStyles = useCallback((): void => {
    const updatedStyle: Style = {
      ...style,
      borderTopRightRadius,
      borderTopLeftRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
      borderColor,
      borderWidth,
      backgroundColor,
      textColor,
      rippleColor,
    };

    localStorage.setItem(key, JSON.stringify(updatedStyle));

    utils.mkToast(`Saved ${key} with success!`);
  }, [
    style,
    borderTopRightRadius,
    borderTopLeftRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    borderColor,
    borderWidth,
    backgroundColor,
    textColor,
    rippleColor,
    key,
  ]);

  useEffect(() => {
    setBorderTopRightRadius(style.borderTopRightRadius);
    setBorderTopLeftRadius(style.borderTopLeftRadius);
    setBorderBottomRightRadius(style.borderBottomRightRadius);
    setBorderBottomLeftRadius(style.borderBottomLeftRadius);
    setBorderColor(style.borderColor);
    setBorderWidth(style.borderWidth);
    setBackgroundColor(style.backgroundColor);
    setTextColor(style.textColor);
    setRippleColor(style.rippleColor);
  }, [style]);

  return (
    <Suspense fallback={<Loader />}>
      <Container
        style={{
          paddingBottom: "3rem",
        }}
      >
        <StarsBG />
        <Preview
          style={{
            borderTopLeftRadius: borderTopLeftRadius + "px",
            borderTopRightRadius: borderTopRightRadius + "px",
            borderBottomRightRadius: borderBottomRightRadius + "px",
            borderBottomLeftRadius: borderBottomLeftRadius + "px",
            borderWidth: borderWidth + "px",
            backgroundColor,
            color: textColor,
            borderColor,
            padding: "1rem",
            minWidth: "230px",
            textAlign: "center",
            borderStyle: "solid",
            transition: "all .3s ease-in-out ",
            rippleColor,
          }}
          text={key === "vexStyle" ? t("vex_message") : t("user_message")}
        />
        <ToastContainer />

        <GoBack onClick={() => navigate("home")}>
          <ClearIcon
            style={{
              fill: "white",
              padding: "5px",
              width: "50px",
              height: "50px",
            }}
            aria-label={t("back_button") as string}
          />
          {t("goBack")}
        </GoBack>

        <FormControlLabel
          control={
            <Checkbox
              checked={key === "vexStyle"}
              onChange={updateStyles}
              sx={{
                margin: "3rem 0 3rem 0",
                color: "white",
                "&.Mui-checked": {
                  color: "white",
                },
              }}
            />
          }
          label={key === "vexStyle" ? t("isVex") : t("isUser")}
          sx={{
            color: "white",
            "&.Mui-checked": {
              color: "white",
            },
          }}
        />
        <Text>{t("topLeftRadius")}</Text>
        <Slider
          theme={darkTheme}
          value={borderTopLeftRadius}
          onChange={(_: Event, value: number | number[]) =>
            setBorderTopLeftRadius(value as number)
          }
          min={0}
          max={30}
          valueLabelDisplay="on"
          aria-label={t("topLeftRadius") as string}
        />
        <Text>{t("topRightRadius")}</Text>
        <Slider
          theme={darkTheme}
          value={borderTopRightRadius}
          onChange={(_: Event, value: number | number[]) =>
            setBorderTopRightRadius(value as number)
          }
          min={0}
          max={30}
          valueLabelDisplay="on"
          aria-label={t("topRightRadius") as string}
        />
        <Text>{t("bottomLeftRadius")}</Text>
        <Slider
          theme={darkTheme}
          value={borderBottomLeftRadius}
          onChange={(_: Event, value: number | number[]) =>
            setBorderBottomLeftRadius(value as number)
          }
          min={0}
          max={30}
          valueLabelDisplay="on"
          aria-label={t("bottomLeftRadius") as string}
        />
        <Text>{t("bottomRightRadius")}</Text>
        <Slider
          theme={darkTheme}
          value={borderBottomRightRadius}
          onChange={(_: Event, value: number | number[]) =>
            setBorderBottomRightRadius(value as number)
          }
          min={0}
          max={30}
          valueLabelDisplay="on"
          aria-label={t("bottomRightRadius") as string}
        />
        <Text>{t("borderWidth")}</Text>
        <Slider
          theme={darkTheme}
          value={borderWidth}
          onChange={(_: Event, value: number | number[]) =>
            setBorderWidth(value as number)
          }
          min={0}
          max={10}
          valueLabelDisplay="on"
          aria-label={t("borderWidth") as string}
        />
        <Text>{t("backgroundColor")}</Text>
        <ButtonBase
          onClick={() => toast(t("select_color"))}
          style={{
            background: backgroundColor,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 0 0 2px #fff",
          }}
        />
        <ChromePicker
          color={backgroundColor}
          onChange={(color: any) => setBackgroundColor(color.hex)}
          disableAlpha
        />
        <Text>{t("text_color")}</Text>
        <ButtonBase
          onClick={() => toast(t("select_color"))}
          style={{
            background: textColor,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 0 0 2px #fff",
          }}
        />
        <ChromePicker
          color={textColor}
          onChange={(color: any) => setTextColor(color.hex)}
        />
        <Text>{t("ripple_color")}</Text>
        <ButtonBase
          onClick={() => toast(t("select_color"))}
          style={{
            background: rippleColor,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 0 0 2px #fff",
          }}
        />
        <ChromePicker
          color={rippleColor}
          onChange={(color: any) => setRippleColor(color.hex)}
        />
        <ThemeProvider
          theme={createTheme({
            palette: {
              primary: {
                main: green[200],
              },
              secondary: {
                main: "#64748B",
              },
            },
          })}
        >
          <Button
            variant="outlined"
            sx={{ mt: "1rem", margin: "2rem 0 1rem 0" }}
            onClick={saveStyles}
          >
            {t("save_styles")}
          </Button>
        </ThemeProvider>
      </Container>
    </Suspense>
  );
};

export default Customize;
