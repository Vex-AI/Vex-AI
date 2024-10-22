import dayjs from "dayjs";
import { db } from "./vexDB";
import { LocalNotifications } from "@capacitor/local-notifications";

interface IStreak {
  currentStreak: number;
  lastAccessed: string;
  dailyUsage: number;
}

let debug = false; // Variável booleana para ativar o modo de debug

// Verifica se o streak é válido e se o usuário passou 4 minutos no app
export const checkStreak = async (timeSpent: number) => {
  const streak = await db.streaks.get(1);
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  if (streak) {
    const updatedDailyUsage = streak.dailyUsage + timeSpent;

    if (streak.lastAccessed === yesterday && updatedDailyUsage >= 240) {
      // Atualiza o streak
      streak.currentStreak += 1;
      streak.lastAccessed = today;
      streak.dailyUsage = timeSpent;
      await db.streaks.put(streak, 1);
    } else if (streak.lastAccessed !== today) {
      streak.currentStreak = 1;
      streak.lastAccessed = today;
      streak.dailyUsage = timeSpent;
      await db.streaks.put(streak, 1);
    } else {
      streak.dailyUsage = updatedDailyUsage; // Atualiza o uso diário
      await db.streaks.put(streak, 1);
    }
  } else {
    console.log("salvando streak");
    await db.streaks.put(
      {
        currentStreak: 1,
        lastAccessed: today,
        dailyUsage: timeSpent,
      },
      1
    );
  }
};

// Modificada para verificar `debug` e enviar notificação a cada 10 segundos
export const scheduleStreakReminder = async () => {
  const streak = await db.streaks.get(1);
  const today = dayjs().format("YYYY-MM-DD");

  if (streak?.lastAccessed !== today) {
    // Define o horário-alvo para a notificação (3 horas antes da meia-noite)
    const now = dayjs();
    const targetTime = dayjs().endOf("day").subtract(3, "hours");

    const sendNotification = async () => {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: "Keep your streak alive!",
            body: "You haven’t used the app today. Don’t forget to keep your streak going!",
            schedule: { at: new Date() }, // Imediato, pois é para debug
          },
        ],
      });
    };

    if (debug) {
      // Se debug estiver ativo, enviar notificação a cada 10 segundos
      setInterval(() => {
        console.log("Debug ativo: notificações sendo enviadas a cada 10 segundos");
        sendNotification();
      }, 10000); // 10 segundos
    } else if (now.isBefore(targetTime)) {
      // Se não estiver no modo debug, agenda para 3 horas antes da meia-noite
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: "Keep your streak alive!",
            body: "You haven’t used the app today. Don’t forget to keep your streak going!",
            schedule: { at: targetTime.toDate() },
          },
        ],
      });
    }
  }
};

// Função para monitorar o tempo de uso do app
export const monitorAppUsage = () => {
  let timeSpent = 0;
  const interval = setInterval(() => {
    timeSpent += 1; // Incrementa 1 segundo a cada segundo

    if (timeSpent >= 240) {
      clearInterval(interval); // Para o monitoramento após 4 minutos
      checkStreak(timeSpent); // Checa e atualiza o streak
    }
  }, 1000);
};

export const getStreakFromDB = async (): Promise<IStreak | undefined> => {
  return await db.streaks.get(1);
};

export const updateDailyUsage = async (timeSpent: number): Promise<void> => {
  const streak = await getStreakFromDB();
  if (streak) {
    await db.streaks.update(1, { dailyUsage: timeSpent });
  }
};
