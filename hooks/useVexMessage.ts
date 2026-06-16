import { useState, useRef, useEffect } from "react";
import { analyzer } from "@/lib/analyzer";
import { sendMessage } from "@/lib/utils";
import { useEmotionStore } from "@/store/useEmotionStore";
import * as VexPsyche from "@/lib/psyche/VexPsyche";
import { useJinkoStore } from "@/store/jinkoStore";
import { jinkoManager } from "@/lib/jinko/JinkoManager";
import i18next from "i18next";

export type ProcessingStatus = "online" | "typing";

export const useVexMessage = () => {
  const [status, setStatus] = useState<ProcessingStatus>("online");
  const setEmotion = useEmotionStore((state) => state.setEmotion);
  const setMood = useEmotionStore((state) => state.setMood);
  const setTyping = useEmotionStore((state) => state.setTyping);
  const { state: jinkoState, setState: setJinkoState, reset: resetJinko } = useJinkoStore();

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
      let vexReply = "";
      const minDelay = new Promise((resolve) => setTimeout(resolve, 1500));

      const processJinkoOrAnalyzer = async () => {
        const isJinkoIntent = new RegExp(i18next.t("jinko.intent_regex"), "i").test(userMessage);

        if (jinkoState === "finished") {
          resetJinko();
        }

        if (jinkoState === "inactive" && isJinkoIntent) {
          setJinkoState("confirming");
          return i18next.t("jinko.confirm_game");
        }

        if (jinkoState === "confirming") {
          if (new RegExp(i18next.t("jinko.regex_confirm_yes"), "i").test(userMessage)) {
            setJinkoState("playing");
            return jinkoManager.startGame();
          } else {
            resetJinko();
            return i18next.t("jinko.cancel_game");
          }
        }

        if (jinkoState === "playing") {
          const { reply, isVictory } = jinkoManager.processUserReply(userMessage);
          if (isVictory) {
            setJinkoState("finished");
          }
          return reply;
        }

        return await analyzer(userMessage);
      };

      [vexReply] = await Promise.all([processJinkoOrAnalyzer(), minDelay]);

      if (isMounted.current) {
        // Get state from VexPsyche
        const emotionEmoji = await VexPsyche.getEmoji();
        const moodIndicator = await VexPsyche.getMoodIndicator();
        
        setEmotion(emotionEmoji);
        setMood(moodIndicator.emoji);
        
        sendMessage(vexReply, true);
        setStatus("online");
        setTyping(false);
      }
    } catch (error) {
      console.error("Ocorreu um erro ao processar a resposta de Vex:", error);
      if (isMounted.current) {
        setEmotion("1f622"); // Sad emoji on error
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

