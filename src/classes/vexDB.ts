//import { BayesClassifier } from "natural/lib/natural/classifiers";
//let classifier = new BayesClassifier();
import BayesClassifier from "bayes";

const l = console.log;
import Dexie, { Transaction } from "dexie";

interface ISynon {
  word: string[];
  reply: string[];
  id: string;
  createdAt?: number;
}

interface IModel {
  model: any;
  id: number;
}

interface IMessage {
  content: string;
  isVex: boolean;
  hour: string;
  date: string;
  id: string;
  createdAt?: number;
}

class VexDB extends Dexie {
  messageList!: Dexie.Table<IMessage>;
  synons!: Dexie.Table<ISynon>;
  model!: Dexie.Table<IModel>;
  constructor() {
    super("vex");
    this.version(1).stores({
      messageList: "id, hour, content, isVex, date, createdAt",
      synons: "++id, word, reply, createdAt",
      model: "id, model",
    });
    this.messageList = this.table("messageList");
    this.synons = this.table("synons");
    this.model = this.table("model");
  }
  dropAllMessageFromDB() {
    this.messageList.clear();
  }
  async saveMessageToDB(message: IMessage): Promise<void> {
    await this.messageList.add({
      ...message,
      createdAt: Date.now(),
    });
  }

  async updateMessageInDB(message: IMessage): Promise<void> {
    await this.messageList.update(message.id, message);
  }

  async deleteMessageFromDB(id: string): Promise<void> {
    await this.messageList.delete(id);
  }

  async addWordToSynonInDB(id: string, value: string): Promise<void> {
    const synon: ISynon | undefined = await this.synons.get(id);
    if (synon) {
      synon.word.push(value);
      await this.synons.update(id, synon);
    }
  }

  async addReplyToSynonInDB(id: string, value: string): Promise<void> {
    const synon: ISynon | undefined = await this.synons.get(id);
    if (synon) {
      synon.reply.push(value);
      await this.synons.update(id, synon);
    }
  }

  async deleteWordFromSynonInDB(id: string, value: string): Promise<void> {
    const synon = await this.synons.get(id);
    if (synon) {
      synon.word = synon.word.filter((word) => word !== value);
      await this.synons.update(id, synon);
    }
  }

  async deleteReplyFromSynonInDB(id: string, value: string): Promise<void> {
    const synon = await this.synons.get(id);
    if (synon) {
      synon.reply = synon.reply.filter((reply) => reply !== value);
      await this.synons.update(id, synon);
    }
  }

  async addSynonToDB(synon: ISynon): Promise<void> {
    await this.synons.add({
      ...synon,
      createdAt: Date.now(),
    });
  }

  async deleteSynonFromDB(id: string): Promise<void> {
    await this.synons.delete(id);
  }

  async saveModelToDB(raw: any): Promise<void> {
    await this.model.clear();
    await this.model.add({
      model: raw,
      id: 0,
    });
    l("Model successfully saved");
  }

  async loadModelFromDB(): Promise<any> {
    const modelData = (await this.model.toArray())[0];
    // console.log(modelData);
    return new Promise((resolve, reject) => {
      if (modelData && modelData.model) {
        l("Loaded classifier");
        resolve(BayesClassifier.fromJson(modelData.model));
      } else {
        l("Created new classifier");
        resolve(BayesClassifier());
      }
    });
  }

  async getAllMessages() {
    return await this.messageList.orderBy("createdAt").toArray();
  }
  async getAllSynons() {
    return await this.synons.toArray();
  }
}

export const db = new VexDB();
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
