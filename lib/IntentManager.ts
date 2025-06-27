import { db } from "./vexDB";
import { IntentClassifier } from "@/classes/IntentClassifier";
import { mkToast } from "./utils"; // Usaremos para feedback visual

// Reinstancia ou obtém a instância do classificador do analyzer
// NOTA: Para uma arquitetura mais robusta, o classificador poderia ser um singleton exportado.
// Por enquanto, vamos assumir que precisamos criar uma nova instância para retreinar.
const intentClassifier = new IntentClassifier();

/**
 * Carrega as intenções para um idioma específico no banco de dados.
 * Esta função irá:
 * 1. Limpar a tabela de intenções existente.
 * 2. Carregar dinamicamente o arquivo JSON do idioma correto.
 * 3. Adicionar as novas intenções ao banco de dados.
 * 4. Retreinar o classificador de intenções com os novos dados.
 *
 * @param language - O código do idioma (ex: 'enUS', 'ptBR').
 */
export async function loadIntentsForLanguage(language: string) {
  console.log(`Iniciando carregamento de intenções para o idioma: ${language}`);
  
  try {
    // 1. Limpa a tabela de intenções atual para evitar duplicatas ou dados misturados.
    await db.intents.clear();
    console.log("Tabela de intenções limpa.");

    // 2. Importa dinamicamente o arquivo JSON de modelo correspondente ao idioma.
    // O Vite/Webpack lidará com isso, encontrando o arquivo correto.
    const intentsToSeedModule = await import(`../vexModels/new_models/${language}.json`);
    const intentsToSeed = intentsToSeedModule.default;

    if (!intentsToSeed || intentsToSeed.length === 0) {
      throw new Error(`Nenhuma intenção encontrada para o idioma ${language}`);
    }

    // 3. Adiciona as novas intenções em massa (bulkAdd) na tabela.
    await db.intents.bulkAdd(intentsToSeed);
    console.log(`${intentsToSeed.length} intenções para '${language}' carregadas no DB.`);

    // 4. Força o retreinamento do classificador com os novos dados.
    // Isso é crucial para que o bot responda no idioma correto.
    await intentClassifier.train();
    console.log("Classificador de intenções retreinado com sucesso.");

    mkToast(`Language and model updated to ${language}!`);

  } catch (error) {
    console.error(`Falha ao carregar intenções para o idioma ${language}:`, error);
    mkToast(`Error loading model for ${language}.`);
  }
}