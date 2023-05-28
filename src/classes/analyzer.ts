import { getAllSynons } from "../store/reducers/vexReducer";
import { responseENUS as response } from "./response";
import util from "./utils";
const { log } = console;
interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}

export async function Analyzer(message: string): Promise<string> {
  const search: ISynon[] = await getAllSynons();
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

  return response[Math.floor(Math.random() * response.length - 1)];
}
