import i18n from "./translation";
import { getCodePoint } from "./utils";
import diacritics from "diacritics";

const EMOTION_MAP: Record<string, string> = {
  happy: "1f604",      // Grinning face with smiling eyes
  sad: "1f622",        // Crying face
  angry: "1f621",      // Pouting face
  thinking: "1f914",   // Thinking face
  loving: "1f970",     // Smiling face with hearts
  neutral: "1f60a",    // Smiling face with smiling eyes
};

const normalizeText = (text: string): string => {
  return diacritics.remove(
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  );
};

export const detectEmotion = (text: string): string => {
  if (!text) return EMOTION_MAP.neutral;

  // 1. Try to extract an actual emoji from the text first
  const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;
  const match = emojiRegex.exec(text);
  if (match) {
    const code = getCodePoint(match[0]);
    if (code) return code;
  }

  // 2. Localized keyword matching using i18n
  const normalizedText = normalizeText(text);
  const categories = ["happy", "sad", "angry", "thinking", "loving"];

  for (const category of categories) {
    const keywords = i18n.t(`emotions.${category}`, { returnObjects: true });
    if (Array.isArray(keywords)) {
      for (const rawKeyword of keywords) {
        const keyword = normalizeText(rawKeyword);
        if (keyword && normalizedText.includes(keyword)) {
          return EMOTION_MAP[category];
        }
      }
    }
  }

  return EMOTION_MAP.neutral;
};
