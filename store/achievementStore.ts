import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface Badge {
  id: string;
  icon: string;
  name: { ptBR: string; enUS: string };
  description: { ptBR: string; enUS: string };
  unlockedAt: number | null;
}

const BADGES: Badge[] = [
  {
    id: "animal_master",
    icon: "🦁",
    name: { ptBR: "Mestre dos Animais", enUS: "Animal Master" },
    description: {
      ptBR: "Vença a Vex na adivinhação de animais 5 vezes",
      enUS: "Beat Vex in the animal guessing game 5 times",
    },
    unlockedAt: null,
  },
  {
    id: "monk_patience",
    icon: "🧘",
    name: { ptBR: "Paciência de Monge", enUS: "Monk Patience" },
    description: {
      ptBR: "Faça a Vex atingir 100% de tédio",
      enUS: "Make Vex reach 100% boredom",
    },
    unlockedAt: null,
  },
  {
    id: "ruthless_villain",
    icon: "😈",
    name: { ptBR: "Vilão Impiedoso", enUS: "Ruthless Villain" },
    description: {
      ptBR: "Acumule mais de 95% de estresse na Vex",
      enUS: "Accumulate over 95% stress on Vex",
    },
    unlockedAt: null,
  },
  {
    id: "dead_battery",
    icon: "🪫",
    name: { ptBR: "Bateria Arriada", enUS: "Dead Battery" },
    description: {
      ptBR: "Zere a energia da Vex para 0%",
      enUS: "Drain Vex's energy to 0%",
    },
    unlockedAt: null,
  },
  {
    id: "unbreakable_bond",
    icon: "🤝",
    name: { ptBR: "Laço Inquebrável", enUS: "Unbreakable Bond" },
    description: {
      ptBR: "Alcance 100% de confiança com a Vex",
      enUS: "Reach 100% trust with Vex",
    },
    unlockedAt: null,
  },
  {
    id: "first_dream",
    icon: "🌙",
    name: { ptBR: "Sonhadora", enUS: "Dreamer" },
    description: {
      ptBR: "Veja o primeiro sonho da Vex",
      enUS: "See Vex's first dream",
    },
    unlockedAt: null,
  },
  {
    id: "chatterbox",
    icon: "💬",
    name: { ptBR: "Tagarela", enUS: "Chatterbox" },
    description: {
      ptBR: "Envie 500 mensagens para a Vex",
      enUS: "Send 500 messages to Vex",
    },
    unlockedAt: null,
  },
  {
    id: "early_bird",
    icon: "🌅",
    name: { ptBR: "Madrugador", enUS: "Early Bird" },
    description: {
      ptBR: "Converse com a Vex entre 4h e 6h da manhã",
      enUS: "Talk to Vex between 4 AM and 6 AM",
    },
    unlockedAt: null,
  },
];

interface AchievementState {
  badges: Badge[];
  jinkoWins: number;
  unlockBadge: (id: string) => void;
  incrementJinkoWins: () => void;
  isBadgeUnlocked: (id: string) => boolean;
}

const getLang = (): "ptBR" | "enUS" => {
  if (typeof localStorage === "undefined") return "enUS";
  const lang = localStorage.getItem("language");
  return lang === "ptBR" ? "ptBR" : "enUS";
};

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      badges: BADGES,
      jinkoWins: 0,

      unlockBadge: (id: string) => {
        const { badges } = get();
        const badge = badges.find((b) => b.id === id);
        if (!badge || badge.unlockedAt) return;

        const lang = getLang();
        const updated = badges.map((b) =>
          b.id === id ? { ...b, unlockedAt: Date.now() } : b
        );

        set({ badges: updated });

        toast.success(`${badge.icon} ${badge.name[lang]}`, {
          description: badge.description[lang],
          duration: 5000,
        });
      },

      incrementJinkoWins: () => {
        const wins = get().jinkoWins + 1;
        set({ jinkoWins: wins });
        if (wins >= 5) {
          get().unlockBadge("animal_master");
        }
      },

      isBadgeUnlocked: (id: string) => {
        return !!get().badges.find((b) => b.id === id)?.unlockedAt;
      },
    }),
    {
      name: "vex-achievements",
      version: 1,
    }
  )
);
