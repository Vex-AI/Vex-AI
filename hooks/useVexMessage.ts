import { useState, useRef, useEffect } from "react";
import { analyzer } from "@/lib/analyzer";
import { sendMessage } from "@/lib/utils";
import { useEmotionStore } from "@/store/useEmotionStore";
import { detectEmotion } from "@/lib/emotionDetector";

export type ProcessingStatus = "online" | "typing";

export const useVexMessage = () => {
  const [status, setStatus] = useState<ProcessingStatus>("online");
  const setEmotion = useEmotionStore((state) => state.setEmotion);
  const setTyping = useEmotionStore((state) => state.setTyping);

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
    setTyping(true);

    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 1500));

      const [vexReply] = await Promise.all([analyzer(userMessage), minDelay]);

      if (isMounted.current) {
        // Detect emotion of the response and update store
        const emotion = detectEmotion(vexReply);
        setEmotion(emotion);
        
        sendMessage(vexReply, true);
        setStatus("online");
        setTyping(false);
      }
    } catch (error) {
      console.error("Ocorreu um erro ao processar a resposta de Vex:", error);
      if (isMounted.current) {
        setEmotion("1f622"); // Sad emoji code if error occurs
        sendMessage(
          "Desculpe, tive um problema para processar sua mensagem.",
          true
        );
        setStatus("online");
        setTyping(false);
      }
    }
  };

  return {
    sendVexMessage,
    isProcessing: status === "typing",
    status,
  };
};
