import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Dexie, { Transaction } from "dexie";
const { log } = console;
import { format } from "date-fns";
const date = new Date();

interface IAddMessageProps {
  content: string;
  isVex: boolean;
  id: string;
}
interface IMessage {
  content: string;
  isVex: boolean;
  hour: string;
  date: string;
  id: string;
  createdAt?: number;
}

interface IVexName {
  vexName: string;
}

interface ISynon {
  word: string[];
  reply: string[];
  id: string;
  createdAt?: number;
}

interface IModel {
  model: any;
}

interface IVexState {
  messageList: IMessage[];
  synons: ISynon[];
  isTyping: boolean;
  vexName: string;
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
      model: "model",
    });
    this.messageList = this.table("messageList");
    this.synons = this.table("synons");
    this.model = this.table("model");
  }
  dropAllMessageFromDB() {
    this.messageList.clear();
  }
}

const db = new VexDB();

db.on("populate", (tx: Transaction) => {
  // Portuguese data
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

  // Spanish data
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

  // Japanese data
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

  // English data
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

async function saveMessageToDB(message: IMessage): Promise<void> {
  await db.messageList.add({
    ...message,
    createdAt: Date.now(),
  });
}

async function updateMessageInDB(message: IMessage): Promise<void> {
  await db.messageList.update(message.id, message);
}

async function deleteMessageFromDB(id: string): Promise<void> {
  await db.messageList.delete(id);
}

async function addWordToSynonInDB(id: string, value: string): Promise<void> {
  const synon: ISynon | undefined = await db.synons.get(id);
  if (synon) {
    synon.word.push(value);
    await db.synons.update(id, synon);
  }
}

async function addReplyToSynonInDB(id: string, value: string): Promise<void> {
  const synon: ISynon | undefined = await db.synons.get(id);
  if (synon) {
    synon.reply.push(value);
    await db.synons.update(id, synon);
  }
}

async function deleteWordFromSynonInDB(
  id: string,
  value: string
): Promise<void> {
  const synon = await db.synons.get(id);
  if (synon) {
    synon.word = synon.word.filter((word) => word !== value);
    await db.synons.update(id, synon);
  }
}

async function deleteReplyFromSynonInDB(
  id: string,
  value: string
): Promise<void> {
  const synon = await db.synons.get(id);
  if (synon) {
    synon.reply = synon.reply.filter((reply) => reply !== value);
    await db.synons.update(id, synon);
  }
}

async function addSynonToDB(synon: ISynon): Promise<void> {
  await db.synons.add({
    ...synon,
    createdAt: Date.now(),
  });
}

async function deleteSynonFromDB(id: string): Promise<void> {
  await db.synons.delete(id);
}

const initialState: IVexState = {
  messageList: [],
  synons: [],
  vexName: "Vex",
  isTyping: false,
};

const vexSlice = createSlice({
  name: "vex",
  initialState,
  reducers: {
    setSynons(state, action: PayloadAction<ISynon[]>) {
      state.synons = action.payload;
    },
    dropAllMessage(state, action: PayloadAction) {
      log("chat cleaned! :D")
      state.messageList = [];
      db.dropAllMessageFromDB();
    },
    setVexName(state, action: PayloadAction<{ vexName: string }>) {
      state.vexName = action.payload.vexName;
    },
    setIsTyping(state) {
      state.isTyping = !state.isTyping;
    },
    setMessages(state, action: PayloadAction<IMessage[]>) {
      state.messageList = action.payload;
    },
    addMessage(state, action: PayloadAction<IAddMessageProps>) {
      const formattedDate = format(date, "MM/dd/yyyy");
      const formattedTime = format(date, "HH:mm");
      const newData: IMessage = {
        ...action.payload,
        hour: formattedTime,
        date: formattedDate,
        createdAt: Date.now(),
      };
      state.messageList.push(newData);
      saveMessageToDB(newData);
    },
    updateMessage(state, action: PayloadAction<IMessage>) {
      const updatedMessage = action.payload;
      state.messageList = state.messageList.map((message) =>
        message.id === updatedMessage.id ? updatedMessage : message
      );
      updateMessageInDB(updatedMessage);
    },
    deleteMessage(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.messageList = state.messageList.filter(
        (message) => message.id !== id
      );
      deleteMessageFromDB(id);
    },
    addSynon(state, action: PayloadAction<ISynon>) {
      state.synons.push(action.payload);
      addSynonToDB(action.payload);
    },
    deleteSynon(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.synons = state.synons.filter((synon) => synon.id !== id);
      deleteSynonFromDB(id);
    },
    addWordToSynon(
      state,
      action: PayloadAction<{ id: string; value: string }>
    ) {
      const { id, value } = action.payload;
      state.synons = state.synons.map((synon) =>
        synon.id === id ? { ...synon, word: [...synon.word, value] } : synon
      );
      addWordToSynonInDB(id, value);
    },
    addReplyToSynon(
      state,
      action: PayloadAction<{ id: string; value: string }>
    ) {
      const { id, value } = action.payload;
      state.synons = state.synons.map((synon) =>
        synon.id === id ? { ...synon, reply: [...synon.reply, value] } : synon
      );
      addReplyToSynonInDB(id, value);
    },
    deleteWordFromSynon(
      state,
      action: PayloadAction<{ id: string; value: string }>
    ) {
      const { id, value } = action.payload;
      state.synons = state.synons.map((synon) =>
        synon.id === id
          ? { ...synon, word: synon.word.filter((word) => word !== value) }
          : synon
      );
      deleteWordFromSynonInDB(id, value);
    },
    deleteReplyFromSynon(
      state,
      action: PayloadAction<{ id: string; value: string }>
    ) {
      const { id, value } = action.payload;
      state.synons = state.synons.map((synon) =>
        synon.id === id
          ? { ...synon, reply: synon.reply.filter((reply) => reply !== value) }
          : synon
      );
      deleteReplyFromSynonInDB(id, value);
    },
  },
});

export async function getAllMessages() {
  return await db.messageList.orderBy("createdAt").toArray();
}

export async function getAllSynons() {
  return await db.synons.toArray();
}

export const {
  setSynons,
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  addSynon,
  deleteSynon,
  addWordToSynon,
  addReplyToSynon,
  deleteWordFromSynon,
  deleteReplyFromSynon,
  setIsTyping,
  dropAllMessage,
} = vexSlice.actions;

export default vexSlice.reducer;
