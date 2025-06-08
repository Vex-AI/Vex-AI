// classes/train.ts
//@ts-ignore
import BayesClassifier from "bayes";
import { db } from "./vexDB";
import { clear } from "./utils";

export async function trainFromSynons(): Promise<void> {
    const classifier = BayesClassifier();
    const synons = await db.synons.toArray();

    synons.forEach(syn => {
        const label = syn.reply[0];
        syn.word.forEach(word => {
            const cleaned = clear(word).join(" ");
            classifier.learn(cleaned, label);
        });
    });

    await db.classifier.put({
        id: 1,
        classifierData: classifier.toJson()
    });
}