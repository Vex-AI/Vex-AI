import {
  IIntent,
  IMessage,
  IStreak,
  IUnclassifiedMessage,
  IVexInfo,
  ISynon,
  IClassifier,
} from "@/types";
import Dexie, { Table, Transaction } from "dexie";

export class vexDB extends Dexie {
  messages!: Table<IMessage>;
  vexInfo!: Table<IVexInfo>;
  streaks!: Table<IStreak>;
  intents!: Table<IIntent>;
  unclassified!: Table<IUnclassifiedMessage>;
  backup_v5!: Table<{
    id?: number;
    table: string;
    data: any;
    createdAt: number;
  }>;

  synons!: Table<ISynon>;
  classifier!: Table<IClassifier>;

  constructor() {
    super("chatDatabase");

    this.version(2).stores({
      messages: "++id, content, isVex, hour, date",
      synons: "++id, word, reply",
      vexInfo: "id,name, profileImage",
      classifier: "id, classifierData",
      streaks: "currentStreak, lastAccessed",
    });

    this.version(3)
      .stores({
        intents: "++id, name, trainingPhrases, responses",
        unclassified: "++id, text, timestamp",
        messages: "++id, content, isVex, hour, date",
        vexInfo: "id,name, profileImage",
        streaks: "currentStreak, lastAccessed",
        synons: null,
        classifier: null,
      })
      .upgrade(async (tx: Transaction) => {
        console.log(
          "Executando migração V2 -> V3: Convertendo 'synons' para 'intents'..."
        );
        const dump = {
          messages: await tx.table("messages_bkp").toArray(),
          intents: await tx.table("intents_bkp").toArray(),
          synons: await tx.table("synons_bkp").toArray(),
          vexInfo: await tx.table("vexInfo_bkp").toArray(),
          streaks: await tx.table("streaks_bkp").toArray(),
        };

        localStorage.setItem("db_backup_v5", JSON.stringify(dump));
        try {
          const oldSynons = await tx.table("synons").toArray();
          if (oldSynons.length > 0) {
            const newIntents = oldSynons.map((synon: ISynon) => ({
              name:
                synon.word && synon.word.length > 0 ? synon.word[0] : synon.id,
              trainingPhrases: synon.word,
              responses: synon.reply,
            }));
            await tx.table("intents").bulkAdd(newIntents);
            console.log(
              `Migração V2 -> V3 concluída. ${newIntents.length} 'synons' movidos para 'intents'.`
            );
          } else {
            console.log(
              "Migração V2 -> V3: Tabela 'synons' encontrada, mas estava vazia."
            );
          }
        } catch (error) {
          console.error("Erro durante a migração V2 -> V3:", error);
        }
      });

    this.version(6).stores({
      messages: "++id, content, isVex, hour, date",

      vexInfo: "id, name, profileImage",
      streaks: "currentStreak, lastAccessed",

      intents: "++id, name",
      unclassified: "++id, timestamp",
    });

    // this.on("populate", this.populateDatabase);
  }

  async populateDatabase(tx: Transaction) {
    console.log("Executando initial database populate (v6)...");

    const initialLanguage = localStorage.getItem("language") || "enUS";
    console.log(`Populating with the initial model for: ${initialLanguage}`);

    try {
      await tx.table("vexInfo").add({
        id: 1,
        name: "Vex",
        profileImage: "/Vex_320.png",
      });

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
