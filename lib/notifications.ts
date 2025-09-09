import { LocalNotifications } from "@capacitor/local-notifications";
import i18n from "i18next";

// Debug flag to toggle behavior between production and development
const debug = false;

// Loads the localized notification messages
const notificationMessages = i18n.t("notifications", {
  returnObjects: true,
}) as { notifications: string[] };

// Function to request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  const { display } = await LocalNotifications.requestPermissions();
  return display === "granted";
};

// Function to get a random message from the available messages
export const getRandomMessage = (): string => {
  if (!notificationMessages || !notificationMessages.notifications.length) {
    console.error("No notification messages available.");
    return "Default message"; // Fallback to prevent errors
  }
  const randomIndex = Math.floor(
    Math.random() * notificationMessages.notifications.length
  );
  return notificationMessages.notifications[randomIndex];
};

// Function to schedule random notifications
export const scheduleRandomNotification = async (): Promise<void> => {
  const permissionGranted = await requestNotificationPermission();

  if (!permissionGranted) {
    console.warn("Permission for notifications not granted.");
    return;
  }

  const message = getRandomMessage();

  // Defines the time interval based on the debug mode
  const intervalInMilliseconds = debug ? 10_000 : 5 * 60 * 60 * 1000; // 10 seconds or 5 hours

  // Schedules the initial notification
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(), // Unique ID for each notification
          title: "Hey!",
          body: message,
          schedule: {
            at: new Date(Date.now() + intervalInMilliseconds), // First notification at the defined interval
          },
        },
      ],
    });

    // Sets up continuous repetition with the defined interval
    if (debug) {
      setInterval(async () => {
        const repeatedMessage = getRandomMessage();

        await LocalNotifications.schedule({
          notifications: [
            {
              id: Date.now(),
              title: "Hey!",
              body: repeatedMessage,
            },
          ],
        });
      }, intervalInMilliseconds);
    }
  } catch (error) {
    console.error("Error scheduling notifications:", error);
  }
};
