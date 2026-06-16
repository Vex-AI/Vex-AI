import { MagicEngine } from "./engine";
import { Animal, Question } from "./engine/types";
import animalsData from "./data/animals.json";
import questionsData from "./data/questions.json";
import i18next from "i18next";

class JinkoGameManager {
  private engine: MagicEngine | null = null;
  private currentQuestionId: string | null = null;

  public startGame(): string {
    this.engine = new MagicEngine(animalsData as Animal[], questionsData as Question[]);
    return this.nextQuestion();
  }

  private nextQuestion(): string {
    if (!this.engine) return i18next.t("jinko.engine_error");

    this.currentQuestionId = this.engine.getBestQuestion();

    if (!this.currentQuestionId) {
      return i18next.t("jinko.out_of_ideas");
    }

    const texts = i18next.t(`jinko.questions.${this.currentQuestionId}`, { returnObjects: true }) as string[];
    if (texts && Array.isArray(texts)) {
      const text = texts[Math.floor(Math.random() * texts.length)];
      return text;
    }

    return i18next.t("jinko.not_sure_what_to_ask");
  }

  public processUserReply(reply: string): { reply: string, isVictory: boolean } {
    if (!this.engine || !this.currentQuestionId) {
      return { reply: i18next.t("jinko.game_not_started"), isVictory: false };
    }

    const lower = reply.toLowerCase();
    let weight = 0;

    if (new RegExp(i18next.t("jinko.regex_no"), "i").test(lower)) {
      weight = -1;
      if (new RegExp(i18next.t("jinko.regex_maybe_no"), "i").test(lower)) weight = -0.5;
    } else if (new RegExp(i18next.t("jinko.regex_yes"), "i").test(lower)) {
      weight = 1;
      if (new RegExp(i18next.t("jinko.regex_maybe_yes"), "i").test(lower)) weight = 0.5;
    } else if (new RegExp(i18next.t("jinko.regex_dont_know"), "i").test(lower)) {
      weight = 0;
    } else {
      // Fallback
      return { reply: i18next.t("jinko.didnt_get_that") + `\n\n_(Debug: Peso não detectado)_`, isVictory: false };
    }

    this.engine.answerQuestion(this.currentQuestionId, weight);

    const victoryAnimal = this.engine.checkVictory();

    if (victoryAnimal) {
      const lang = i18next.language?.substring(0, 2) === 'en' ? 'en' : 'pt';
      const animalName = (victoryAnimal.name as any)[lang] || victoryAnimal.name;
      const emojiMatch = typeof animalName === 'string' ? animalName.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) : null;
      const emoji = emojiMatch ? emojiMatch[0] : "🐾";
      const nameWithoutEmoji = typeof animalName === 'string' ? animalName.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim() : animalName;

      return { 
        reply: i18next.t("jinko.victory", { name: nameWithoutEmoji, emoji: emoji }) + `\n\n_(Debug: Peso interpretado para a última resposta: ${weight})_`, 
        isVictory: true 
      };
    }

    return { reply: this.nextQuestion() + `\n\n_(Debug: Peso interpretado para a resposta anterior: ${weight})_`, isVictory: false };
  }
}

export const jinkoManager = new JinkoGameManager();
