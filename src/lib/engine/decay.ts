import type { SubtopicStatus } from './types'

// ─── Pure Decay & Retention Functions ─────────────────────────────────────────

/**
 * Calculates retention score D (0 - 100) using an exponential half-life forgetting curve:
 * D = 100 * exp(- (elapsedDays * ln(2)) / halfLifeDays)
 *
 * @param lastPracticedAt Epoch timestamp (ms) of the last practice session
 * @param halfLifeDays Configurable half-life (typically 14 - 30 days, default 21)
 * @param now Current timestamp in ms (defaults to Date.now())
 * @param fallbackConfidence Optional fallback concept confidence (1-5) if never practiced
 */
export function calculateRetentionScore(
  lastPracticedAt: number | undefined,
  halfLifeDays = 21,
  now = Date.now(),
  fallbackConfidence?: number
): number {
  if (!lastPracticedAt || lastPracticedAt <= 0) {
    if (fallbackConfidence !== undefined && fallbackConfidence > 1) {
      // If user rated concept confidence but hasn't practiced, retain their initial concept estimate
      return Math.round(((fallbackConfidence - 1) / 4) * 100)
    }
    return 0
  }

  const elapsedMs = Math.max(0, now - lastPracticedAt)
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24)

  if (halfLifeDays <= 0) return 0

  // Exponential half-life decay formula
  const decayExponent = (elapsedDays * Math.LN2) / halfLifeDays
  const retention = 100 * Math.exp(-decayExponent)

  return Math.round(Math.max(0, Math.min(100, retention)))
}

/**
 * Flags if a subtopic is due for spaced-repetition revision.
 * Triggered when retention score drops below threshold (default 50%)
 * AND the user has either rated confidence >= 3 (Comfortable+) OR has logged practice before.
 */
export function isRevisionDue(
  retentionScore: number,
  conceptScore: number,
  masteryScore: number,
  thresholdPercent = 50
): boolean {
  const hasPriorKnowledge = conceptScore >= 50 || masteryScore > 0
  return hasPriorKnowledge && retentionScore < thresholdPercent
}

/**
 * Evaluates high-level status badge for a subtopic.
 */
export function evaluateSubtopicStatus(
  totalReadiness: number,
  retentionScore: number,
  conceptScore: number,
  masteryScore: number,
  revisionThreshold = 50
): SubtopicStatus {
  if (conceptScore === 0 && masteryScore === 0 && retentionScore === 0) {
    return 'Untouched'
  }

  if (isRevisionDue(retentionScore, conceptScore, masteryScore, revisionThreshold)) {
    return 'Revision Due'
  }

  if (totalReadiness >= 80 && retentionScore >= 70) {
    return 'Mastered'
  }

  if (totalReadiness >= 40) {
    return 'In Progress'
  }

  return 'Needs Practice'
}
