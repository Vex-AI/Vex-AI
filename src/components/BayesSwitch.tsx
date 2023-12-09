import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import { connect } from "react-redux";
import { RootState } from "../store/";
import { Dispatch } from "redux";
import { switchBayes } from "../store/reducers/vexReducer";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff0000",
    },
  },
});

interface IBayesSwitchProps {
  doAction?: () => void;
  dispatch: Dispatch;
}

const BayesSwitch: React.FC<IBayesSwitchProps> = ({
  doAction = () => {},
  dispatch,
}) => {
  const [bayesEnabled, setBayesEnabled] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("bayes");
    return storedValue ? true : false;
  });

  const handleSwitchChange = () => {
    const newValue = !bayesEnabled;
    setBayesEnabled(newValue);
    localStorage.setItem("bayes", JSON.stringify(newValue));
    dispatch(switchBayes({ useBayes: newValue }));
    doAction();
    console.log(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Switch
        checked={bayesEnabled}
        onChange={handleSwitchChange}
        color="primary"
        inputProps={{ "aria-label": "Bayes Switch" }}
      />
    </ThemeProvider>
  );
};

export default connect((state: RootState) => ({
  useBayes: state.vex.useBayes,
}))(BayesSwitch);
