import { db } from "./vexDB";
// 1. Importe a função refreshClassifier do analyzer
import { refreshClassifier } from "./analyzer"; 
import { mkToast } from "./utils"; 

// 2. REMOVA a linha: const intentClassifier = new IntentClassifier();
// Não precisamos de uma instância local aqui.

/**
 * Loads intents for a specific language into the database.
 * This function uses localStorage to track if the data has already been seeded.
 *
 * @param language - The language code (e.g., 'enUS', 'ptBR').
 * @param forceUpdate - (Optional) Set true to force database update (e.g. user changed language manually).
 */
export async function loadIntentsForLanguage(language: string, forceUpdate: boolean = false) {
  //console.log(`Starting intent loading for language: ${language}`);
  const SEED_KEY = "vex_seeded_language";

  try {
    // 1. Check localStorage to see which language was last seeded.
    const lastSeededLanguage = localStorage.getItem(SEED_KEY);

    // Determine if we need to seed the database.
    const shouldSeed = forceUpdate || lastSeededLanguage !== language;

    if (shouldSeed) {
      // 2. Clears the current intents table to avoid duplicates or mixed data.
      if ((await db.intents.count()) > 0) {
         await db.intents.clear();
      }

      // 3. Dynamically imports the model JSON file.
      const intentsToSeedModule = await import(
        `../vexModels/new_models/${language}.json`
      );
      const intentsToSeed = intentsToSeedModule.default;

      if (!intentsToSeed || intentsToSeed.length === 0) {
        throw new Error(`No intents found for language ${language}`);
      }

      // 4. Adds the new intents in bulk (bulkAdd) to the table.
      await db.intents.bulkAdd(intentsToSeed);

      // 5. Update the localStorage key.
      localStorage.setItem(SEED_KEY, language);

      if (forceUpdate || lastSeededLanguage !== language) {
          mkToast(`Language and model updated to ${language}!`);
      }
    }

    // 6. Forces the ACTUAL classifier in analyzer.ts to retrain.
    // This updates the memory of the bot used in the chat window.
    await refreshClassifier(); 
    // console.log("Intent classifier retrained successfully.");

  } catch (error) {
    console.error(`Failed to load intents for language ${language}:`, error);
    mkToast(`Error loading model for ${language}.`);
    
    localStorage.removeItem(SEED_KEY);
  }
}