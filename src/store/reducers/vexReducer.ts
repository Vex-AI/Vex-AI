import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";

const { log } = console;
import { format } from "date-fns";
const date = new Date();
import { db } from "../../classes/vexDB";
//import BayesClassifier from "bayes";

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

interface IVexState {
  messageList: IMessage[];
  synons: ISynon[];
  isTyping: boolean;
  vexName: string;
  profileImage: string;
  useBayes: boolean;
}

const initialState: IVexState = {
  messageList: [],
  synons: [],
  vexName: localStorage.getItem("vexName") ?? "Vex",
  profileImage: localStorage.getItem("profileImage") ?? "/Vex_320.png",
  isTyping: false,
  useBayes: localStorage.getItem("bayes") ? true : false,
};

const vexSlice: Slice<IVexState> = createSlice({
  name: "vex",
  initialState,
  reducers: {
    setSynons(state, action: PayloadAction<ISynon[]>) {
      state.synons = action.payload;
    },
    switchBayes(state, action: PayloadAction<{ useBayes: boolean }>) {
      state.useBayes = action.payload.useBayes;
      console.log({ cheated: state.useBayes });
    },
    dropAllMessage(state, action: PayloadAction) {
      log("chat cleaned! :D");
      state.messageList = [];
      db.dropAllMessageFromDB();
    },
    setVexName(state, action: PayloadAction<{ vexName: string }>) {
      let { vexName } = action.payload;
      vexName = vexName.slice(0, 12);
      state.vexName = vexName;
      localStorage.setItem("vexName", vexName);
    },
    setProfileImage(state, action: PayloadAction<{ imageContent: string }>) {
      localStorage.setItem("profileImage", action.payload.imageContent);
      state.profileImage = action.payload.imageContent;
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
      db.saveMessageToDB(newData);
    },
    updateMessage(state, action: PayloadAction<IMessage>) {
      const updatedMessage = action.payload;
      state.messageList = state.messageList.map((message: IMessage) =>
        message.id === updatedMessage.id ? updatedMessage : message
      );
      db.updateMessageInDB(updatedMessage);
    },
    deleteMessage(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.messageList = state.messageList.filter(
        (message: IMessage) => message.id !== id
      );
      db.deleteMessageFromDB(id);
    },
    addSynon(state, action: PayloadAction<ISynon>) {
      state.synons.push(action.payload);
      db.addSynonToDB(action.payload);
    },
    deleteSynon(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.synons = state.synons.filter((synon: ISynon) => synon.id !== id);
      db.deleteSynonFromDB(id);
    },
    addWordToSynon(
      state,
      action: PayloadAction<{ id: string; value: string }>
    ) {
      const { id, value } = action.payload;
      state.synons = state.synons.map((synon: ISynon) =>
        synon.id === id ? { ...synon, word: [...synon.word, value] } : synon
      );
      db.addWordToSynonInDB(id, value);
    },
    addReplyToSynon(
      state,
      action: PayloadAction<{ id: string; value: string }>
    ) {
      const { id, value } = action.payload;
      state.synons = state.synons.map((synon: ISynon) =>
        synon.id === id ? { ...synon, reply: [...synon.reply, value] } : synon
      );
      db.addReplyToSynonInDB(id, value);
    },
    deleteWordFromSynon(
      state,
      action: PayloadAction<{ id: string; value: string }>
    ) {
      const { id, value } = action.payload;
      state.synons = state.synons.map((synon: ISynon) =>
        synon.id === id
          ? {
              ...synon,
              word: synon.word.filter((word: string) => word !== value),
            }
          : synon
      );
      db.deleteWordFromSynonInDB(id, value);
    },
    deleteReplyFromSynon(
      state,
      action: PayloadAction<{ id: string; value: string }>
    ) {
      const { id, value } = action.payload;
      state.synons = state.synons.map((synon: ISynon) =>
        synon.id === id
          ? {
              ...synon,
              reply: synon.reply.filter((reply: string) => reply !== value),
            }
          : synon
      );
      db.deleteReplyFromSynonInDB(id, value);
    },
  },
});

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
  setVexName,
  setProfileImage,
  switchBayes,
} = vexSlice.actions;

export default vexSlice.reducer;
