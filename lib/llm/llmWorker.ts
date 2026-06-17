import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

// A simple Web Worker that handles incoming messages from the main thread
// and proxies them to the WebWorkerMLCEngineHandler.
const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};
