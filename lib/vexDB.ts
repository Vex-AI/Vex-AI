import { IClassifier, IMessage, IStreak, ISynon, IVexInfo } from "@/types";
import Dexie, { Table, Transaction } from "dexie";


export class vexDB extends Dexie {
  messages!: Table<IMessage>;
  vexInfo!: Table<IVexInfo>;
  synons!: Table<ISynon>;
  classifier!: Table<IClassifier>;
  streaks!: Table<IStreak>;
  constructor() {
    super("chatDatabase");
    this.version(2).stores({
      messages: "++id, content, isVex, hour, date",
      synons: "++id, word, reply",
      vexInfo: "id,name, profileImage",
      classifier: "id, classifierData",
      streaks: 'currentStreak, lastAccessed',
    });
  }
}

export const db = new vexDB();

db.on("populate", (tx: Transaction) => {
  const addSynonyms = (id: string, word: string[], reply: string[]) => {
    tx.table("synons").add({
      id,
      word,
      reply,
    });
  };

  addSynonyms(
    "1",
    ["oi", "olá", "e aí", "alô", "bom dia"],
    [
      "Olá, tudo bem?",
      "Oi, como posso ajudar?",
      "E aí, tudo tranquilo?",
      "Alô, tem alguém aí?",
      "Bom dia, como você está?",
    ]
  );

  addSynonyms(
    "2",
    ["hola", "buenos días", "qué tal", "adiós", "hasta luego"],
    [
      "¡Hola!",
      "Buenos días, ¿cómo estás?",
      "¿Qué tal?",
      "¡Adiós!",
      "Hasta luego, nos vemos más tarde.",
    ]
  );

  addSynonyms(
    "3",
    ["こんにちは", "おはよう", "さようなら", "おやすみ", "ありがとう"],
    [
      "こんにちは！",
      "おはようございます！",
      "さようなら！",
      "おやすみなさい。",
      "ありがとうございます！",
    ]
  );

  addSynonyms(
    "4",
    ["hello", "hi", "hey", "good morning", "goodbye"],
    [
      "Hello!",
      "Hi, how can I assist you?",
      "Hey there!",
      "Good morning, how are you?",
      "Goodbye, take care!",
    ]
  );
});

db.on("populate", (tx: Transaction) => {
  tx.table("vexInfo").add({
    id: 1,
    name: "Vex",
    // profileImage: "https://avatars.githubusercontent.com/u/119815111?s=512&v=4",
    profileImage: "/Vex_320.png",
  });
});
