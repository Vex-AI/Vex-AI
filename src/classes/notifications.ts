import { LocalNotifications } from "@capacitor/local-notifications";
import i18n from "i18next";

// Variável de debug para alternar o comportamento entre produção e desenvolvimento
const debug = false;

// Carrega as mensagens de notificação localizadas
const notificationMessages = i18n.t("notifications", {
    returnObjects: true
}) as { notifications: string[] };

// Função para solicitar permissão de notificações
export const requestNotificationPermission = async (): Promise<boolean> => {
    const { display } = await LocalNotifications.requestPermissions();
    return display === "granted";
};

// Função para obter uma mensagem aleatória das mensagens disponíveis
export const getRandomMessage = (): string => {
    if (!notificationMessages || !notificationMessages.notifications.length) {
        console.error("Nenhuma mensagem de notificação disponível.");
        return "Mensagem padrão"; // Fallback para evitar erros
    }
    const randomIndex = Math.floor(
        Math.random() * notificationMessages.notifications.length
    );
    return notificationMessages.notifications[randomIndex];
};

// Função para agendar notificações aleatórias
export const scheduleRandomNotification = async (): Promise<void> => {
    const permissionGranted = await requestNotificationPermission();

    if (!permissionGranted) {
        console.warn("Permissão para notificações não concedida.");
        return;
    }

    const message = getRandomMessage();
    console.log("Mensagem selecionada:", message);

    // Define o intervalo de tempo com base no modo debug
    const intervalInMilliseconds = debug ? 10_000 : 5 * 60 * 60 * 1000; // 10 segundos ou 5 horas

    // Agenda a notificação inicial
    try {
        await LocalNotifications.schedule({
            notifications: [
                {
                    id: Date.now(), // ID único para cada notificação
                    title: "Hey!",
                    body: message,
                    schedule: {
                        at: new Date(Date.now() + intervalInMilliseconds) // Primeira notificação no intervalo definido
                    }
                }
            ]
        });

        // Configura repetição contínua com intervalo definido
        if (debug) {
            setInterval(async () => {
                const repeatedMessage = getRandomMessage();
                console.log("Enviando notificação repetida:", repeatedMessage);

                await LocalNotifications.schedule({
                    notifications: [
                        {
                            id: Date.now(),
                            title: "Hey!",
                            body: repeatedMessage
                        }
                    ]
                });
            }, intervalInMilliseconds);
        }
    } catch (error) {
        console.error("Erro ao agendar notificações:", error);
    }
};
