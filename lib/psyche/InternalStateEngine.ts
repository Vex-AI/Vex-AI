// lib/psyche/InternalStateEngine.ts
import type { InternalState, SentimentResult, EmotionState } from "@/types/psyche";
import i18n from "../translation";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Update internal state (energy, stress, boredom, motivation) based on the current interaction.
 */
export function updateInternalState(
  state: InternalState,
  emotions: EmotionState,
  sentiment: SentimentResult,
  userMessage: string,
  lastInteraction: number
): InternalState {
  const now = Date.now();
  const minutesSinceLast = (now - lastInteraction) / (1000 * 60);

  const nextState = { ...state };

  // 1. ENERGY: Depletes with interaction, recovers with time
  // Long interactions deplete more energy.
  const energyCost = 2 + Math.min(10, userMessage.length / 50);
  nextState.energy = clamp(nextState.energy - energyCost);
  
  // If user was away, recover energy (10 points per hour)
  if (minutesSinceLast > 30) {
    const recovery = (minutesSinceLast / 60) * 10;
    nextState.energy = clamp(nextState.energy + recovery);
  }

  // 2. STRESS: Increases with high arousal negative interactions
  if (sentiment.valence < -0.3) {
    nextState.stress = clamp(nextState.stress + (sentiment.arousal * 15));
  } else if (sentiment.valence > 0.5) {
    // Positive interactions reduce stress
    nextState.stress = clamp(nextState.stress - 5);
  }
  
  // Time away reduces stress slightly
  if (minutesSinceLast > 60) {
    nextState.stress = clamp(nextState.stress - 10);
  }

  // 3. BOREDOM: Increases if emotions are flat/neutral
  if (sentiment.arousal < 0.2 && emotions.curiosity < 40) {
    nextState.boredom = clamp(nextState.boredom + 5);
  } else {
    // High arousal or high curiosity reduces boredom
    nextState.boredom = clamp(nextState.boredom - (sentiment.arousal * 20));
  }

  // 4. MOTIVATION: Linked to energy and stress
  nextState.motivation = clamp((nextState.energy * 0.7) - (nextState.stress * 0.5) + 30);

  return nextState;
}

/**
 * Check if the internal state is critical and should override the response.
 */
export function checkInternalStateOverride(state: InternalState): string | null {
  // Highest priority: Exhaustion
  if (state.energy < 15) {
    return i18n.t("psyche_state_tired");
  }

  // High priority: Stress breakdown
  if (state.stress > 85) {
    return i18n.t("psyche_state_stressed");
  }

  // Medium priority: Extreme boredom
  if (state.boredom > 85) {
    return i18n.t("psyche_state_bored");
  }

  return null;
}
