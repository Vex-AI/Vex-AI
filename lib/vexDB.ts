// lib/vexDB.ts

import {
  IIntent,
  IMessage,
  IStreak,
  IUnclassifiedMessage,
  IVexInfo,
} from "@/types";
import Dexie, { Table, Transaction } from "dexie";

export class vexDB extends Dexie {
  messages!: Table<IMessage>;
  vexInfo!: Table<IVexInfo>;
  streaks!: Table<IStreak>;
  intents!: Table<IIntent>;
  unclassified!: Table<IUnclassifiedMessage>;

  constructor() {
    super("chatDatabase");

    this.version(6).stores({
      messages: "++id, content, isVex, hour, date",
      vexInfo: "++id, name, profileImage", // We use ++id for autoincrement
      streaks: "++id, currentStreak, lastAccessed",
      intents: "++id, name",
      unclassified: "++id, timestamp",
    });

    // A SINGLE SOURCE OF TRUTH FOR POPULATING THE DB
    this.on("populate", this.populateDatabase);
  }

  // The function that populates the database on creation
  async populateDatabase(tx: Transaction) {
    console.log("Executing initial database populate...");

    // Adds default Vex information
    await tx.table("vexInfo").add({
      name: "Vex",
      profileImage: "/Vex_320.png",
    });

    // Gets the language from localStorage or defaults to 'enUS'
    const initialLanguage = localStorage.getItem("language") || "enUS";
    console.log(`Populating with the initial model for: ${initialLanguage}`);

    try {
      // Uses the same dynamic import logic
      //@ts-ignore
      const intentsToSeedModule = await import(
        `../vexModels/new_models/${initialLanguage}.json`
      );
      const intentsToSeed = intentsToSeedModule.default;

      if (intentsToSeed && intentsToSeed.length > 0) {
        await tx.table("intents").bulkAdd(intentsToSeed);
      }
      console.log("Database populated successfully!");
    } catch (error) {
      console.error(
        "Failed to populate the database with initial intents:",
        error
      );
    }
  }
}
export const db = new vexDB();
