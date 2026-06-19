import { createRoot } from "react-dom/client";
import { useEffect, useState, lazy, Suspense } from "react";
import { App } from "@capacitor/app";
import { Keyboard } from "@capacitor/keyboard";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router";
import { DesktopSidebar } from "@/components/desktop-sidebar";

import { Toaster } from "sonner";

import "@/index.css";

const Home = lazy(() => import("@/app/page"));
const EditProfile = lazy(() => import("@/app/profile/page"));
const IntentPage = lazy(() => import("@/app/intents/page"));
const Functions = lazy(() => import("@/app/functions/page"));
const LanguageSelector = lazy(() => import("@/app/language/page"));
const Customize = lazy(() => import("@/app/customize/page"));
const ConsentPage = lazy(() => import("@/app/consent/page"));
const StreakPage = lazy(() => import("@/app/streak/page"));
const StatsPage = lazy(() => import("@/app/stats/page"));
const SettingsPage = lazy(() => import("@/app/settings/page"));
const JinkoPage = lazy(() => import("@/app/jinko/page"));
const AchievementsPage = lazy(() => import("@/app/achievements/page"));
import { ThemeProvider } from "@/components/theme-provider";
import { ChangelogModal } from "@/components/changelog-modal";

import ChatLoading from "@/components/chat-loading";

import { MessagesProvider } from "@/contexts/MessagesContext";

const Layout = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    let handle: any | null = null;
    let kbShowHandle: any | null = null;
    let kbHideHandle: any | null = null;

    // Listen to native back button
    App.addListener("backButton", () => {
      const currentPath = window.location.pathname;
      if (currentPath === "/" || currentPath.startsWith("/enUS") || currentPath.startsWith("/ptBR")) {
        App.exitApp();
      } else {
        window.history.back();
      }
    }).then((h) => {
      handle = h;
    });

    // Listen to Keyboard to manually push layout
    if (typeof window !== "undefined" && (window as any).Capacitor?.isNative) {
      Keyboard.addListener("keyboardWillShow", (info) => {
        setKeyboardHeight(info.keyboardHeight);
      }).then(h => kbShowHandle = h);

      Keyboard.addListener("keyboardWillHide", () => {
        setKeyboardHeight(0);
      }).then(h => kbHideHandle = h);
    }

    return () => {
      handle?.remove();
      kbShowHandle?.remove();
      kbHideHandle?.remove();
    };
  }, []);

  return (
    <MessagesProvider>
      <div 
        className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-[padding] duration-150 ease-out"
        style={{ paddingBottom: `${keyboardHeight}px` }}
      >
        <DesktopSidebar />
        <div className="flex-1 min-w-0 relative h-full">
          <Suspense fallback={<ChatLoading />}>
            <Outlet />
          </Suspense>
        </div>
        <ChangelogModal />
      </div>
    </MessagesProvider>
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
