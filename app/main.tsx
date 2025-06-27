import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router";
import { IonApp, IonPage, IonContent, setupIonicReact } from "@ionic/react";
import { App as CapacitorApp } from "@capacitor/app";
import { useEffect } from "react";

import "@/index.css";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Pages */
import Home from "@/app/page";
import EditProfile from "@/app/profile/page";
import IntentPage from "@/app/intents/page";
import Functions from "@/app/functions/page";
import LanguageSelector from "@/app/language/page";
import Customize from "@/app/customize/page";
import ConsentPage from "@/app/consent/page";
import StreakPage from "@/app/streak/page";

setupIonicReact({ mode: "md" });

const Layout = () => {
  useEffect(() => {
    const handler = (ev: any) => {
      ev.detail.register(-1, () => {
        CapacitorApp.exitApp();
      });
    };
    document.addEventListener("ionBackButton", handler);
    return () => document.removeEventListener("ionBackButton", handler);
  }, []);

  return (
    <IonApp>
      <IonPage>
        <IonContent fullscreen>oii
          <Outlet />
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/home" replace /> },
      { path: "/home", element: <Home /> },
      { path: "/profile", element: <EditProfile /> },
      { path: "/intents", element: <IntentPage /> },
      { path: "/functions", element: <Functions /> },
      { path: "/language", element: <LanguageSelector /> },
      { path: "/customize", element: <Customize /> },
      { path: "/consent", element: <ConsentPage /> },
      { path: "/streak", element: <StreakPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
