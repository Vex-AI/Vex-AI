// lib/psyche/RelationshipEngine.ts
import type { Relationship } from "@/types/psyche";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Updates relationship parameters based on the valence of the current interaction.
 * Relationship stats move very slowly compared to emotions.
 */
export function updateRelationship(
  current: Relationship,
  valence: number
): Relationship {
  // Valence is -1.0 to 1.0. We want small incremental changes.
  const delta = valence * 2.5; 

  const newRel = { ...current };

  newRel.affection = clamp(newRel.affection + delta * 0.8);
  newRel.respect = clamp(newRel.respect + delta * 0.5);
  newRel.trust = clamp(newRel.trust + delta * 0.6);
  
  // Attachment goes up regardless of positive/negative, 
  // as long as there is an interaction, but very slowly.
  newRel.attachment = clamp(newRel.attachment + Math.abs(delta) * 0.1);

  return newRel;
}

export type RelationshipLevel = "estrano" | "conhecido" | "amigo" | "proximo" | "inimigo";

/**
 * Categorize the relationship into levels based on stats.
 */
export function getRelationshipLevel(rel: Relationship): RelationshipLevel {
  if (rel.trust < 20 && rel.affection < 20) {
    return "inimigo";
  }
  if (rel.affection > 80 && rel.trust > 80 && rel.attachment > 60) {
    return "proximo";
  }
  if (rel.affection > 60 && rel.trust > 60) {
    return "amigo";
  }
  if (rel.attachment > 30) {
    return "conhecido";
  }
  return "estrano";
}
