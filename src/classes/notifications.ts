import { LocalNotifications } from "@capacitor/local-notifications";
import i18n from "i18next";

let debug = true; // Variável de debug para ativar o modo de depuração
const notificationMessages = i18n.t("notifications", {
  returnObjects: true,
}) as any;

export const requestNotificationPermission = async () => {
  const permission = await LocalNotifications.requestPermissions();
  return permission;
};

export const getRandomMessage = () => {
  const randomIndex = Math.floor(
    Math.random() * notificationMessages.notifications.length - 1
  );
  return notificationMessages.notifications[randomIndex];
};

export const scheduleRandomNotification = async () => {
  // Solicita permissão para enviar notificações
  const permission = await requestNotificationPermission();

  // Se a permissão for concedida, agende a notificação
  if (permission.display === "granted") {
    const message = getRandomMessage();
    console.log("Mensagem aleatória:", message);

    // Define o intervalo de tempo com base no modo debug
    const intervalInMilliseconds = debug ? 10000 : 5 * 60 * 60 * 1000; // 10 segundos ou 5 horas

    // Agenda a notificação inicial
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(), // ID único para cada notificação
          title: "Hey!",
          body: message, // Mensagem aleatória
          schedule: {
            at: new Date(Date.now() + intervalInMilliseconds), // Agenda com base no intervalo definido
            repeats: true, // Repetição ativada
          },
        },
      ],
    });
  }
};
