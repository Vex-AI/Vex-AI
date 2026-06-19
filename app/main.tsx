import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { App } from "@capacitor/app";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router";
import { DesktopSidebar } from "@/components/desktop-sidebar";

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
import StatsPage from "@/app/stats/page";
import SettingsPage from "@/app/settings/page";
import JinkoPage from "@/app/jinko/page";
import AchievementsPage from "@/app/achievements/page";
import { ThemeProvider } from "@/components/theme-provider";
import { ChangelogModal } from "@/components/changelog-modal";

import ChatLoading from "@/components/chat-loading";

const Layout = () => {
  useEffect(() => {
    let handle: any | null = null;

    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    }).then((h) => {
      handle = h;
    });

    return () => {
      handle?.remove();
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <DesktopSidebar />
      <div className="flex-1 min-w-0 relative h-full">
        <Outlet />
      </div>
      <ChangelogModal />
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
      { path: "/stats", element: <StatsPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/jinko", element: <JinkoPage /> },
      { path: "/achievements", element: <AchievementsPage /> },
      { path: "/teste", element: <ChatLoading /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="app-theme">
    <RouterProvider router={router} />
    <Toaster richColors theme="dark" />
  </ThemeProvider>
);
