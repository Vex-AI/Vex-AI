import { CreateWebWorkerMLCEngine, InitProgressReport, WebWorkerMLCEngine } from "@mlc-ai/web-llm";
import { useLLMStore } from "@/store/llmStore";
import { generateSystemPrompt } from "./PromptBuilder";

class LLMManager {
  private engine: WebWorkerMLCEngine | null = null;
  private isInitializing: boolean = false;

  async initEngine(modelId: string = "gemma-2b-it-q4f16_1-MLC") {
    if (this.isInitializing) return;
    this.isInitializing = true;
    
    try {
      const { setDownloadProgress, setEngineReady } = useLLMStore.getState();
      setEngineReady(false);
      
      const initProgressCallback = (initProgress: InitProgressReport) => {
        const percent = Math.round(initProgress.progress * 100);
        setDownloadProgress(percent, initProgress.text);
      };

      const worker = new Worker(new URL("./llmWorker.ts", import.meta.url), { type: "module" });
      
      this.engine = await CreateWebWorkerMLCEngine(
        worker,
        modelId,
        { initProgressCallback }
      );
      
      setEngineReady(true);
      console.log("[WebLLM] Engine initialized successfully.");
    } catch (err) {
      console.error("[WebLLM] Failed to initialize engine:", err);
      useLLMStore.getState().setDownloadProgress(0, "Failed to load model.");
    } finally {
      this.isInitializing = false;
    }
  }

  async generateResponse(userMessage: string): Promise<string> {
    if (!this.engine) {
      throw new Error("Engine is not initialized.");
    }

    const systemPrompt = await generateSystemPrompt();

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userMessage }
    ];

    const reply = await this.engine.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    return reply.choices[0].message.content || "...";
  }
}

export const llmManager = new LLMManager();
