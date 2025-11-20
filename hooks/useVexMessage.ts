import { useState, useRef, useEffect } from "react";
import { analyzer } from "@/lib/analyzer";
import { sendMessage } from "@/lib/utils";

export type ProcessingStatus = "online" | "typing";

export const useVexMessage = () => {
  const [status, setStatus] = useState<ProcessingStatus>("online");

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const sendVexMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setStatus("typing");

    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 1500));

      const [vexReply] = await Promise.all([analyzer(userMessage), minDelay]);

      if (isMounted.current) {
        sendMessage(vexReply, true);
        setStatus("online");
      }
    } catch (error) {
      console.error("Ocorreu um erro ao processar a resposta de Vex:", error);
      if (isMounted.current) {
        sendMessage(
          "Desculpe, tive um problema para processar sua mensagem.",
          true
        );
        setStatus("online");
      }
    }
  };

  return {
    sendVexMessage,
    isProcessing: status === "typing",
    status,
  };
};
