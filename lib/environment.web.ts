// src/services/environment.web.ts
export class EnvironmentWeb {
    async getGeminiKey(): Promise<{ key: string }> {
        
        return { key: import.meta.env.VITE_GEMINI_API_KEY };
    }
}
