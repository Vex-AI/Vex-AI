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
    version: "1.6.0",
    date: "2026-06-16",
    features: [
      "VexPsyche Engine: A comprehensive emotional and psychological engine replacing the legacy emotion detector.",
      "Internal State Engine: Manages energy, stress, boredom, emotional memory, trauma detection, and relationship mechanics.",
      "Psychological Stats Dashboard: View a complete real-time dashboard of Vex's internal states.",
      "Dynamic Mood Avatar: Added toggle in profile settings and chat header to show animated mood emojis.",
      "Settings Management: New page to configure Gemini API keys and oversee emotional state injections.",
      "Framer Motion Animations: All settings pages (Profile, Language, Customize, Intents) have been beautifully redesigned with smooth animations.",
      "Modern Desktop Sidebar: Extracted sidebar navigation for a powerful, persistent desktop experience.",
      "Redesigned Chat Interface: Enhanced input bar, quick actions, pill-shaped profile header, and GeminiPillToggle.",
      "Intelligent Chat Auto-Scroll: Persistent chat scroll position and intelligent auto-scroll behavior.",
      "Unified Sticky Headers: Consistent, sticky top-bar layout integrated across all application sub-pages."
    ],
    fixes: [
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
      }
    ],
    improvements: [
      "Deep UI Cleanup: Systematically removed glow shadow effects and decorative gradients for a cleaner, modern look.",
      "Message Bubble Aesthetics: Refined border radius, padding, and typography across the chat.",
      "Chat Scroll Restoration: Improved behavior with increased bottom padding.",
      "Redesigned Modals: Complete redesign of Phrase and Response modals with internationalized labels.",
      "Translation Consistency: Heavily updated localization strings across settings and dynamic pages.",
      "Focus Management: Added baseline-browser-mapping and implemented input focus management."
    ]
  }
];
