import dayjs from "dayjs";
import { db } from "./vexDB";
import { LocalNotifications } from "@capacitor/local-notifications";
import { IStreak } from "@/types";

const DEBUG_MODE = false; // Define o modo de depuração (debug)

// Atualiza o streak do usuário no banco de dados
export const checkStreak = async (timeSpent: number): Promise<void> => {
  try {
    const streak = await db.streaks.get(1);
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    if (streak) {
      const updatedDailyUsage = streak.dailyUsage + timeSpent;

      // Atualiza o streak se o dia anterior foi acessado e o tempo mínimo foi atingido
      if (streak.lastAccessed === yesterday && updatedDailyUsage >= 240) {
        streak.currentStreak += 1;
        streak.lastAccessed = today;
        streak.dailyUsage = timeSpent;
      } else if (streak.lastAccessed !== today) {
        // Reseta o streak se não foi acessado ontem
        streak.currentStreak = 1;
        streak.lastAccessed = today;
        streak.dailyUsage = timeSpent;
      } else {
        // Atualiza apenas o uso diário
        streak.dailyUsage = updatedDailyUsage;
      }
      await db.streaks.put(streak, 1);
    } else {
      // Caso seja a primeira entrada
      await db.streaks.put(
        {
          currentStreak: 1,
          lastAccessed: today,
          dailyUsage: timeSpent,
        },
        1
      );
    }
  } catch (error) {
    console.error("Erro ao verificar o streak:", error);
  }
};

// Agenda a notificação diária de streak
export const scheduleStreakReminder = async (): Promise<void> => {
  try {
    const streak = await db.streaks.get(1);
    const today = dayjs().format("YYYY-MM-DD");

    if (!streak || streak.lastAccessed !== today) {
      const now = dayjs();
      const targetTime = dayjs().endOf("day").subtract(3, "hours");

      if (DEBUG_MODE) {
        // Notificações frequentes no modo debug
        setInterval(async () => {
          console.log("DEBUG: Enviando notificação de streak.");
          await sendNotification(
            "Keep your streak alive!",
            "Use o app por 4 minutos hoje para manter seu streak!"
          );
        }, 10000); // 10 segundos
      } else if (now.isBefore(targetTime)) {
        // Agenda para 3 horas antes da meia-noite
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 1,
              title: "Keep your streak alive!",
              body: "Use o app por 4 minutos hoje para manter seu streak!",
              schedule: { at: targetTime.toDate() },
            },
          ],
        });
      }
    }
  } catch (error) {
    console.error("Erro ao agendar a notificação de streak:", error);
  }
};

// Envia uma notificação imediata
const sendNotification = async (title: string, body: string): Promise<void> => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Math.floor(Math.random() * 1000), // ID único para evitar conflitos
          title,
          body,
          schedule: { at: new Date() }, // Envia imediatamente
        },
      ],
    });
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
  }
};

// Monitoramento do tempo de uso do app
export const monitorAppUsage = (): void => {
  let timeSpent = 0;

  const interval = setInterval(() => {
    timeSpent += 1; // Incrementa 1 segundo a cada segundo

    if (timeSpent >= 240) {
      // Após 4 minutos (240 segundos), atualiza o streak e para o monitoramento
      clearInterval(interval);
      checkStreak(timeSpent);
    }
  }, 1000);
};

// Recupera o streak atual do banco de dados
export const getStreakFromDB = async (): Promise<IStreak | undefined> => {
  try {
    return await db.streaks.get(1);
  } catch (error) {
    console.error("Erro ao buscar streak do banco de dados:", error);
    return undefined;
  }
};

// Atualiza o uso diário no banco de dados
export const updateDailyUsage = async (timeSpent: number): Promise<void> => {
  try {
    const streak = await getStreakFromDB();
    if (streak) {
      await db.streaks.update(1, { dailyUsage: timeSpent });
    }
  } catch (error) {
    console.error("Erro ao atualizar o uso diário:", error);
  }
};
