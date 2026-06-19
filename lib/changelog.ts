export type BugLevel = "Critical" | "High" | "Medium" | "Low";

export interface BugFix {
  description: string;
  level: BugLevel;
}

export interface ChangelogRelease {
  version: string;
  date: string;
  features: string[];
  fixes: BugFix[];
  improvements: string[];
}

export const changelogHistory: ChangelogRelease[] = [
  {
    version: "1.6.1",
    date: new Date().toISOString().split('T')[0],
    features: [
      "Gemini Learning System: Vex now auto-learns new intents silently in the background when processing successful Gemini API responses without freezing the UI.",
      "NLP Engine Overhaul: Complete rewrite of the local offline TF-IDF engine. Introduced language-aware stemming, Bigram (n-grams) support, and Slang normalization maps.",
      "Hybrid Intent Scoring: Replaced strict exact-match with a robust Hybrid scoring system combining Cosine Similarity and Keyword Overlap (Jaccard)."
    ],
    fixes: [],
    improvements: [
      "AdMob Interstitials: Implemented a 15-minute strict cooldown and reduced the spawn probability to 25% even after the cooldown expires, drastically reducing ad spam.",
      "NLP Memory Optimization: Replaced O(n*m) Levenshtein matrix with O(min(n, m)) rolling array to prevent memory leaks on mobile devices."
    ]
  },
  {
    version: "1.6.0",
    date: "2026-06-17",
    features: [
      "Offline Dream System (DreamEngine): Vex now has an autonomous offline life. If the app is closed for more than 6 hours, she will inject an organic dream message upon return, influenced by her latest psychological state.",
      "Gamification & Achievements System: Introduced an interactive badge system with 8 initial unlockable trophies (e.g., Animal Master, Dead Battery, Chatterbox) tracked securely via Zustand persist.",
      "Interactive Badges Gallery: A new `/achievements` dashboard to track unlocked and mysterious locked badges with beautiful dark mode UI.",
      "Introduced a new interactive animal guessing game system.",
      "Implemented various UI design improvements and visual bug fixes across the interface.",
      "Automated VexPsyche Test Suite: Implemented 16 rigorous unit tests to mathematically secure the SentimentAnalyzer, EmotionEngine, and InternalStateEngine algorithms.",
      "Testing Infrastructure: Successfully integrated Vitest into the ecosystem for blazingly fast assertion checks.",
      "VexPsyche Engine: A comprehensive emotional and psychological engine replacing the legacy emotion detector.",
      "Internal State Engine: Manages energy, stress, boredom, emotional memory, trauma detection, and relationship mechanics.",
      "Psychological Stats Dashboard: View a complete real-time dashboard of Vex's internal states.",
      "Dynamic Mood Avatar: Added toggle in profile settings and chat header to show animated mood emojis.",
      "Settings Management: New page to configure Gemini API keys and oversee emotional state injections.",
      "Framer Motion Animations: All settings pages (Profile, Language, Customize, Intents) have been beautifully redesigned with smooth animations.",
      "Modern Desktop Sidebar: Extracted sidebar navigation for a powerful, persistent desktop experience.",
      "Redesigned Chat Interface: Enhanced input bar, quick actions, pill-shaped profile header, and GeminiPillToggle.",
      "Intelligent Chat Auto-Scroll: Persistent chat scroll position and intelligent auto-scroll behavior.",
      "Unified Sticky Headers: Consistent, sticky top-bar layout integrated across all application sub-pages.",
      "Advanced Gemini Settings: Added intuitive sliders for Temperature, Top K, Top P, and dynamic safety configuration directly from the settings page.",
      "Organic Psychological Prompting: Vex's internal mood and emotional states are now dynamically injected into the Gemini Prompt API, profoundly altering her personality and behavior per message."
    ],
    fixes: [
      {
        description: "Resolved critical layout blowout in the Jinko Simulator causing the Animals Table to aggressively push off-screen.",
        level: "High"
      },
      {
        description: "Fixed TypeScript compilation failure in legacy Jinko tests related to outdated bilingual string assertions.",
        level: "Medium"
      },
      {
        description: "Eliminated probabilistic test flakiness ('fator surpresa') from Jinko's decision engine in sterile test environments.",
        level: "Low"
      },
      {
        description: "Fixed missing JSX closing tags causing parser confusion between 'table' and 'simulator' tabs.",
        level: "Medium"
      },
      {
        description: "Secured localStorage access in SSR/Node environments to prevent crashes during test execution.",
        level: "High"
      },
      {
        description: "Resolved accessibility warnings by adding required DialogDescription to modals.",
        level: "High"
      },
      {
        description: "Set explicit dark theme for Toaster component to correctly match the app theme.",
        level: "Medium"
      },
      {
        description: "Fixed back buttons incorrectly showing redundant 'Exit' text on desktop header.",
        level: "Medium"
      },
      {
        description: "Restored missing translation keys for customization save/delete success notifications.",
        level: "Medium"
      },
      {
        description: "Replaced ambiguous plus icon with a Trash2 icon in the clear chat button.",
        level: "Low"
      },
      {
        description: "Resolved Chat Scroll Jump: Eliminated visual layout jumping on chat mount using React useLayoutEffect and virtualizer alignment.",
        level: "High"
      },
      {
        description: "Global Messages Persistence: Hooked messages query to a root level MessagesContext to completely eliminate Dexie database reloading during route navigation.",
        level: "High"
      },
      {
        description: "Chat Status Layout: Prevented long localized text (e.g. 'digitando...') from getting cut-off or wrapped in the chat header.",
        level: "Medium"
      },
      {
        description: "Animated Emoji Fallbacks: Implemented seamless Native Emoji fallback with fixed dimensions for when Google Noto Animated fails (404), fixing layout shifts.",
        level: "Medium"
      }
    ],
    improvements: [
      "Jinko Table Styling: Enforced grid-cols-1 safety constraints to prevent horizontal overflow on large datasets.",
      "Deep UI Cleanup: Systematically removed glow shadow effects and decorative gradients for a cleaner, modern look.",
      "Message Bubble Aesthetics: Refined border radius, padding, and typography across the chat.",
      "Chat Scroll Restoration: Improved behavior with increased bottom padding.",
      "Redesigned Modals: Complete redesign of Phrase and Response modals with internationalized labels.",
      "Translation Consistency: Heavily updated localization strings across settings and dynamic pages.",
      "Focus Management: Added baseline-browser-mapping and implemented input focus management.",
      "Settings Layout: Adopted full screen relative wrapper to fix scrolling issues and containerized the sticky save button to prevent UI overlaps."
    ]
  }
];
