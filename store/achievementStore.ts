import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface Badge {
  id: string;
  icon: string;
  name: { ptBR: string; enUS: string; ja: string };
  description: { ptBR: string; enUS: string; ja: string };
  unlockedAt: number | null;
}

const BADGES: Badge[] = [
  {
    id: "animal_master",
    icon: "🦁",
    name: { ptBR: "Mestre dos Animais", enUS: "Animal Master", ja: "動物マスター" },
    description: {
      ptBR: "Vença a Vex na adivinhação de animais 5 vezes",
      enUS: "Beat Vex in the animal guessing game 5 times",
      ja: "動物当てゲームでVexに5回勝利する",
    },
    unlockedAt: null,
  },
  {
    id: "monk_patience",
    icon: "🧘",
    name: { ptBR: "Paciência de Monge", enUS: "Monk Patience", ja: "僧侶の忍耐" },
    description: {
      ptBR: "Faça a Vex atingir 100% de tédio",
      enUS: "Make Vex reach 100% boredom",
      ja: "Vexの退屈度を100%にする",
    },
    unlockedAt: null,
  },
  {
    id: "ruthless_villain",
    icon: "😈",
    name: { ptBR: "Vilão Impiedoso", enUS: "Ruthless Villain", ja: "冷酷な悪役" },
    description: {
      ptBR: "Acumule mais de 95% de estresse na Vex",
      enUS: "Accumulate over 95% stress on Vex",
      ja: "Vexのストレスを95%以上蓄積する",
    },
    unlockedAt: null,
  },
  {
    id: "dead_battery",
    icon: "🪫",
    name: { ptBR: "Bateria Arriada", enUS: "Dead Battery", ja: "バッテリー切れ" },
    description: {
      ptBR: "Zere a energia da Vex para 0%",
      enUS: "Drain Vex's energy to 0%",
      ja: "Vexのエネルギーを0%にする",
    },
    unlockedAt: null,
  },
  {
    id: "unbreakable_bond",
    icon: "🤝",
    name: { ptBR: "Laço Inquebrável", enUS: "Unbreakable Bond", ja: "壊れない絆" },
    description: {
      ptBR: "Alcance 100% de confiança com a Vex",
      enUS: "Reach 100% trust with Vex",
      ja: "Vexとの信頼度100%に到達する",
    },
    unlockedAt: null,
  },
  {
    id: "first_dream",
    icon: "🌙",
    name: { ptBR: "Sonhadora", enUS: "Dreamer", ja: "夢見る少女" },
    description: {
      ptBR: "Veja o primeiro sonho da Vex",
      enUS: "See Vex's first dream",
      ja: "Vexの初めての夢を見る",
    },
    unlockedAt: null,
  },
  {
    id: "chatterbox",
    icon: "💬",
    name: { ptBR: "Tagarela", enUS: "Chatterbox", ja: "おしゃべり" },
    description: {
      ptBR: "Envie 500 mensagens para a Vex",
      enUS: "Send 500 messages to Vex",
      ja: "Vexに500件のメッセージを送信する",
    },
    unlockedAt: null,
  },
  {
    id: "early_bird",
    icon: "🌅",
    name: { ptBR: "Madrugador", enUS: "Early Bird", ja: "早起き" },
    description: {
      ptBR: "Converse com a Vex entre 4h e 6h da manhã",
      enUS: "Talk to Vex between 4 AM and 6 AM",
      ja: "午前4時から午前6時の間にVexと話す",
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

const getLang = (): "ptBR" | "enUS" | "ja" => {
  if (typeof localStorage === "undefined") return "enUS";
  const lang = localStorage.getItem("language");
  if (lang === "ptBR") return "ptBR";
  if (lang === "ja") return "ja";
  return "enUS";
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
