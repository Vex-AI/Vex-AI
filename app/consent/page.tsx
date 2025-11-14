"use client";

import React from "react";
import { useNavigate } from "react-router";
import { t } from "i18next";
import { LocalNotifications } from "@capacitor/local-notifications";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const go = (path: string) => {
    navigate(path, { replace: true });
  };

  const requestNotificationPermission = async () => {
    const result = await LocalNotifications.requestPermissions();
    if (result.display === "granted") {
      go("/home");
    } else {
      go("/home");
    }

    localStorage.setItem("notification_consent_given", "true");
  };

  const handleDenyPermission = () => {
    localStorage.setItem("notification_consent_given", "true");
    go("/home");
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 items-center justify-center border-b px-4">
        <h1 className="text-xl font-bold">{t("notification.title")}</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <BellRing className="mb-4 h-32 w-32 text-primary" />
          <h2 className="mb-2 text-2xl font-bold">
            {t("notification.header")}
          </h2>
          <p className="mb-6 text-muted-foreground">
            {t("notification.description")}
          </p>
          <div className="w-full max-w-sm space-y-4">
            <Button
              size="lg"
              className="w-full"
              onClick={requestNotificationPermission}
            >
              {t("notification.enable")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleDenyPermission}
            >
              {t("notification.deny")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConsentPage;
