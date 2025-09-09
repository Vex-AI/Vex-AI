import { useState } from "react";
import { analyzer } from "@/lib/analyzer";
import { sendMessage } from "@/lib/utils";

export type ProcessingStatus = "online" | "typing";

export const useVexMessage = () => {
  const [status, setStatus] = useState<ProcessingStatus>("online");

  const sendVexMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setStatus("typing");

    try {
      const vexReply = await analyzer(userMessage);
      sendMessage(vexReply, true);
    } catch (error) {
      console.error("Ocorreu um erro ao processar a resposta de Vex:", error);
      sendMessage(
        "Desculpe, tive um problema para processar sua mensagem.",
        true
      );
    } finally {
      setStatus("online");
    }
  };

  return {
    sendVexMessage,
    isProcessing: status === "typing",

    status,
  };
};
