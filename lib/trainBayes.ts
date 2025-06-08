//@ts-ignore
import BayesClassifier from "bayes";
import { db } from "./vexDB";

let classifier: BayesClassifier = BayesClassifier();

export async function initClassifier() {
  const saved = await db.classifier.get(1);
  if (saved?.classifierData) {
    classifier = BayesClassifier.fromJson(saved.classifierData);
  } else {
    classifier = BayesClassifier();
    await db.classifier.put({ id: 1, classifierData: classifier.toJson() });
  }
  return classifier;
}

export function getClassifier() {
  return classifier;
}

export async function trainClassifier(input: string, output: string) {
  if (!input.trim() || !output.trim()) return;
  classifier.learn(input, output);
  await db.classifier.put({ id: 1, classifierData: classifier.toJson() });
}