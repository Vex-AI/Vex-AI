import Dexie, { Table, Transaction } from "dexie";

export interface IMessage {
  content: string;
  isVex: boolean;
  hour: string;
  date: number;
}
export interface IVexInfo {
  name: string;
  profileImage: string;
}
export interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}
interface IClassifier {
  id: number;
  classifierData: string;
}

export class vexDB extends Dexie {
  messages!: Table<IMessage>;
  vexInfo!: Table<IVexInfo>;
  synons!: Table<ISynon>;
  classifier!: Table<IClassifier>;
  constructor() {
    super("chatDatabase");
    this.version(1).stores({
      messages: "++id, content, isVex, hour, date",
      synons: "++id, word, reply",
      vexInfo: "id,name, profileImage",
      classifier: "id, classifierData", 
    });
  }
}

export const db = new vexDB();

db.on("populate", (tx: Transaction) => {
  tx.table("synons").add({
    word: ["oi", "olá", "e aí", "alô", "bom dia"],
    reply: [
      "Olá, tudo bem?",
      "Oi, como posso ajudar?",
      "E aí, tudo tranquilo?",
      "Alô, tem alguém aí?",
      "Bom dia, como você está?",
    ],
    id: "1",
  });
  tx.table("synons").add({
    word: ["hola", "buenos días", "qué tal", "adiós", "hasta luego"],
    reply: [
      "¡Hola!",
      "Buenos días, ¿cómo estás?",
      "¿Qué tal?",
      "¡Adiós!",
      "Hasta luego, nos vemos más tarde.",
    ],
    id: "2",
  });

  tx.table("synons").add({
    word: ["こんにちは", "おはよう", "さようなら", "おやすみ", "ありがとう"],
    reply: [
      "こんにちは！",
      "おはようございます！",
      "さようなら！",
      "おやすみなさい。",
      "ありがとうございます！",
    ],
    id: "3",
  });
  tx.table("synons").add({
    word: ["hello", "hi", "hey", "good morning", "goodbye"],
    reply: [
      "Hello!",
      "Hi, how can I assist you?",
      "Hey there!",
      "Good morning, how are you?",
      "Goodbye, take care!",
    ],
    id: "4",
  });
});

db.on("populate", (tx: Transaction) => {
  tx.table("vexInfo").add({
    id: 1,
    name: "Vex",
    // profileImage: "https://avatars.githubusercontent.com/u/119815111?s=512&v=4",
    profileImage: "/Vex_320.png",
  });
});
