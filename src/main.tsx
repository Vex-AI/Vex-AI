import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  useIonRouter,
} from "@ionic/react";
import Home from "./views/Home";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

import SynonPage from "./views/SynonPage";
import Functions from "./views/Functions";
import LanguageSelector from "./components/LanguageSelector";
import Customize from "./views/Customize";
import VexModelsLoader from "./views/VexModelsLoader";
import { App } from "@capacitor/app";
import EditProfile from "./views/EditProfile";

setupIonicReact({
  mode: "md",
});
const Main = () => {

 
  const ionRouter = useIonRouter();
  document.addEventListener("ionBackButton", (ev: any) => {
    ev.detail.register(-1, () => {
      if (!ionRouter.canGoBack()) {
        App.exitApp();
      }
    });
  });
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home" component={Home} />
          <Route path="/profile" component={EditProfile} />
          <Route path="/synons" component={SynonPage} />
          <Route path="/functions" component={Functions} />
          <Route path="/language" component={LanguageSelector} />
          <Route path="/customize" component={Customize} />
          <Route path="/loader" component={VexModelsLoader} />
          <Redirect exact from="/" to="/home" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
