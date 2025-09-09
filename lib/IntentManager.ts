import { db } from "./vexDB";
import { IntentClassifier } from "@/classes/IntentClassifier";
import { mkToast } from "./utils"; // We'll use this for visual feedback

// Re-instantiates or gets the classifier instance from the analyzer
// NOTE: For a more robust architecture, the classifier could be an exported singleton.
// For now, we'll assume we need to create a new instance to retrain.
const intentClassifier = new IntentClassifier();

/**
 * Loads intents for a specific language into the database.
 * This function will:
 * 1. Clear the existing intents table.
 * 2. Dynamically load the correct language JSON file.
 * 3. Add the new intents to the database.
 * 4. Retrain the intent classifier with the new data.
 *
 * @param language - The language code (e.g., 'enUS', 'ptBR').
 */
export async function loadIntentsForLanguage(language: string) {
  console.log(`Starting intent loading for language: ${language}`);

  try {
    // 1. Clears the current intents table to avoid duplicates or mixed data.
    await db.intents.clear();
    console.log("Intents table cleared.");

    // 2. Dynamically imports the model JSON file corresponding to the language.
    // Vite/Webpack will handle this, finding the correct file.
    const intentsToSeedModule = await import(
      `../vexModels/new_models/${language}.json`
    );
    const intentsToSeed = intentsToSeedModule.default;

    if (!intentsToSeed || intentsToSeed.length === 0) {
      throw new Error(`No intents found for language ${language}`);
    }

    // 3. Adds the new intents in bulk (bulkAdd) to the table.
    await db.intents.bulkAdd(intentsToSeed);
    console.log(
      `${intentsToSeed.length} intents for '${language}' loaded into the DB.`
    );

    // 4. Forces the classifier to retrain with the new data.
    // This is crucial so that the bot responds in the correct language.
    await intentClassifier.train();
    console.log("Intent classifier retrained successfully.");

    mkToast(`Language and model updated to ${language}!`);
  } catch (error) {
    console.error(`Failed to load intents for language ${language}:`, error);
    mkToast(`Error loading model for ${language}.`);
  }
}
