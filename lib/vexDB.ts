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
      vexInfo: "++id, name, profileImage", // Usamos ++id para autoincremento
      streaks: "++id, currentStreak, lastAccessed",
      intents: "++id, name",
      unclassified: "++id, timestamp",
    });

    // UMA ÚNICA FONTE DE VERDADE PARA POPULAR O DB
    this.on("populate", this.populateDatabase);
  }

  // A função que popula o banco de dados na criação
  async populateDatabase(tx: Transaction) {
    console.log("Executando populate do banco de dados inicial...");

    // Adiciona informações padrão do Vex
    await tx.table("vexInfo").add({
      name: "Vex",
      profileImage: "/Vex_320.png",
    });

    // Pega o idioma do localStorage ou usa o padrão 'enUS'
    const initialLanguage = localStorage.getItem("language") || "enUS";
    console.log(`Populando com o modelo inicial para: ${initialLanguage}`);

    try {
      // Usa a mesma lógica de importação dinâmica
      //@ts-ignore
      const intentsToSeedModule = await import(
        `../vexModels/new_models/${initialLanguage}.json`
      );
      const intentsToSeed = intentsToSeedModule.default;

      if (intentsToSeed && intentsToSeed.length > 0) {
        await tx.table("intents").bulkAdd(intentsToSeed);
      }
      console.log("Banco de dados populado com sucesso!");
    } catch (error) {
      console.error(
        "Falha ao popular o banco de dados com intenções iniciais:",
        error
      );
    }
  }
}
export const db = new vexDB();
