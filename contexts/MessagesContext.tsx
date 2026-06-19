import { createContext, useContext, ReactNode } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/vexDB";
import type { IMessage } from "@/types";

interface MessagesContextType {
  messages: IMessage[] | undefined;
}

const MessagesContext = createContext<MessagesContextType>({ messages: undefined });

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const messages = useLiveQuery(() => db.messages.toArray(), []);

  return (
    <MessagesContext.Provider value={{ messages }}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);
