import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router";

import { Toaster } from "sonner";

import "@/index.css";

import Home from "@/app/page";
import EditProfile from "@/app/profile/page";
import IntentPage from "@/app/intents/page";
import Functions from "@/app/functions/page";
import LanguageSelector from "@/app/language/page";
import Customize from "@/app/customize/page";
import ConsentPage from "@/app/consent/page";
import StreakPage from "@/app/streak/page";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

const Layout = () => {
  return (
    <div className="h-full w-full bg-background text-foreground">
      <Outlet />
    </div>
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
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <RouterProvider router={router} />
      <Toaster richColors />
    </ThemeProvider>
  </React.StrictMode>
);
