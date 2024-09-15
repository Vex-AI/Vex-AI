import { db } from "./vexDB";
import util from "./utils";
import i18n from "./translation";

interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}

export async function analyzer(message: string): Promise<string> {
  const search: ISynon[] = (await db.synons.toArray()).map((item: ISynon) => {
    return {
      ...item,
      word: item.word.map((word) => {
        return util.clear(word).join(" ");
      }),
    };
  });

  const cleaned: string[] = util.clear(message);

  for (const word of cleaned) {
    const matched: ISynon | undefined = search.find((item: ISynon) =>
      item.word.includes(word)
    );

    if (matched) {
      const randomIndex: number = Math.floor(
        Math.random() * matched.reply.length
      );
      return matched.reply[randomIndex];
    }
  }

  const matchedMessage: ISynon | undefined = search.find((item: ISynon) =>
    item.word.includes(cleaned.join(" "))
  );

  if (matchedMessage) {
    const randomIndex: number = Math.floor(
      Math.random() * matchedMessage.reply.length
    );
    return matchedMessage.reply[randomIndex];
  }
  const responsePromise = await import(
    `../response/response_${i18n.language}.json`
  );
  const response = await responsePromise.default;
  const randomIndex: number = Math.floor(Math.random() * response.length);
  return response[randomIndex];
}
