import { useState, useRef, useEffect } from "react";
import { analyzer } from "@/lib/analyzer";
import { sendMessage } from "@/lib/utils";
import { useEmotionStore } from "@/store/useEmotionStore";
import * as VexPsyche from "@/lib/psyche/VexPsyche";
import { useJinkoStore } from "@/store/jinkoStore";
import { jinkoManager } from "@/lib/jinko/JinkoManager";
import i18next from "i18next";
import { calculateOrganicTypingTime } from "@/lib/typing-simulator";

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

  const sendVexMessage = async (userMessage: string, isRetry: boolean = false) => {
    if (!userMessage.trim()) return;

    setStatus("typing");
    setTyping(true);

    let isLlmDone = false;

    try {
      let vexReply = "";

      const processJinkoOrAnalyzer = async () => {
        let currentState = jinkoState;

        if (currentState === "finished") {
          const playAgainRegex = new RegExp(i18next.t("jinko.play_again_regex"), "i");
          const intentRegex = new RegExp(i18next.t("jinko.intent_regex"), "i");
          
          if (playAgainRegex.test(userMessage) || intentRegex.test(userMessage)) {
            setJinkoState("playing");
            return jinkoManager.startGame();
          }
          
          resetJinko();
          currentState = "inactive";
        }

        const isJinkoIntent = new RegExp(i18next.t("jinko.intent_regex"), "i").test(userMessage);

        if (currentState === "inactive" && isJinkoIntent) {
          setJinkoState("confirming");
          return i18next.t("jinko.confirm_game");
        }

        if (currentState === "confirming") {
          if (new RegExp(i18next.t("jinko.regex_confirm_yes"), "i").test(userMessage)) {
            setJinkoState("playing");
            return jinkoManager.startGame();
          } else {
            resetJinko();
            return i18next.t("jinko.cancel_game");
          }
        }

        if (currentState === "playing") {
          const { reply, isVictory } = jinkoManager.processUserReply(userMessage);
          if (isVictory) {
            setJinkoState("finished");
          }
          return reply;
        }

        return await analyzer(userMessage, false, isRetry);
      };

      // Start the LLM request
      const llmPromise = (async () => {
        const reply = await processJinkoOrAnalyzer();
        isLlmDone = true;
        return reply;
      })();

      let timeSpentTyping = 0;

      // Start organic typing animation loop while waiting for LLM
      const typingAnimationPromise = (async () => {
        let elapsed = 0;
        let isCurrentlyTyping = true; // local flag since 'status' state might be stale in this closure
        
        while (!isLlmDone) {
          await new Promise(r => setTimeout(r, 100));
          elapsed += 100;
          if (isCurrentlyTyping) timeSpentTyping += 100;
          
          // Every ~2.5 seconds, 35% chance to stop typing (thinking/pausing)
          if (elapsed > 2500 && Math.random() < 0.35) {
             isCurrentlyTyping = false;
             setStatus("online");
             setTyping(false);
             
             // Pause duration between 800ms and 2000ms
             const pauseMs = 800 + Math.random() * 1200;
             for(let p = 0; p < pauseMs; p += 100) {
                 if (isLlmDone) break;
                 await new Promise(r => setTimeout(r, 100));
             }
             elapsed = 0;
             
             // Resume typing if LLM still working
             if (!isLlmDone) {
                 isCurrentlyTyping = true;
                 setStatus("typing");
                 setTyping(true);
             }
          }
        }
      })();

      // Wait for LLM to finish
      vexReply = await llmPromise;
      
      // Ensure loop exits
      isLlmDone = true;
      await typingAnimationPromise;

      // Final typing burst based on actual human typing speed for the specific text
      const targetTypingTime = calculateOrganicTypingTime(vexReply);
      
      // Calculate how much MORE time we need to type to reach the human target.
      // We clamp it so it's not absurdly long (max 6 seconds of final burst), but 
      // guarantees a massive text takes a proper amount of time.
      const remainingTypingTime = Math.max(800, targetTypingTime - timeSpentTyping);
      const finalBurst = Math.min(remainingTypingTime, 6000); 
      
      setStatus("typing");
      setTyping(true);
      await new Promise(r => setTimeout(r, finalBurst));

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
    } catch (error: any) {
      isLlmDone = true; // Stop the background typing loop!
      console.error("Ocorreu um erro ao processar a resposta de Vex:", error);
      if (isMounted.current) {
        if (error.message === "GEMINI_API_ERROR") {
          setEmotion("1f635_200d_1f4ab"); // Dizzy face
          sendMessage(
            i18next.t("geminiErrorVexMsg", "Nossa, deu um probleminha de conexão na minha cabeça com o Gemini! 😵‍💫 Tenta de novo?"),
            true,
            true
          );
        } else {
          setEmotion("1f622"); // Sad emoji on error
          sendMessage(
            "Desculpe, tive um problema para processar sua mensagem.",
            true
          );
        }
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

