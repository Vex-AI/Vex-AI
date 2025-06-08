import { useCallback, useState } from "react";
import { t } from "i18next";
import { UseVexMessageProps } from "@/types";
import { sendMessage } from "@/lib/utils";

export function useVexMessage({ classifier, analyzer }: UseVexMessageProps) {
  const [isTrainDisabled, setIsTrainDisabled] = useState(false);
  const [status, setStatus] = useState("on-line");

  const sendVexMessage = useCallback(
    async (raw: string) => {
      const content = String(raw);
      if (!content.trim()) return;

      const geminiEnabled = localStorage.getItem("geminiEnabled") === "true";
      const useBayes =
        !geminiEnabled && localStorage.getItem("bayesEnabled") !== "false";

      setIsTrainDisabled(true);
      setStatus("digitando...");

      const handleResponse = async (answer: string) => {
        console.log({answer})
        const delay =
          answer.length > 30 ? 2000 + Math.random() * 2000 : answer.length * 50;
        setTimeout(() => {
          sendMessage(answer, true);
          setStatus("on-line");
          setIsTrainDisabled(false);
        }, delay);
      };

      if (useBayes) {
        try {
          const answer = await classifier.categorize(content);
          await handleResponse(answer);
          return;
        } catch (e) {
          console.error("Bayes error:", e);
        }
      }

      try {
        const answer = await analyzer(content);
        await handleResponse(answer);
      } catch (e) {
        console.error("Erro no analyzer:", e);
        await handleResponse(t("error_default"));
      }
    },
    []
  );

  return {
    sendVexMessage,
    isTrainDisabled,
    status,
    setStatus,
  };
}
