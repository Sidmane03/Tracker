import type {
  ConceptConfidence,
  Difficulty,
  Outcome,
  PracticeLog,
  Subtopic,
} from '@/types/domain'
import type { ScoreBreakdown } from './types'

// ─── Constants & Weights ──────────────────────────────────────────────────────

export const DIFFICULTY_WEIGHTS: Record<Difficulty, number> = {
  Easy: 1.0,
  Medium: 2.0,
  Hard: 3.5,
}

export const OUTCOME_MULTIPLIERS: Record<Outcome, number> = {
  Solved: 1.0,
  Struggled: 0.5,
  'Needed Help': 0.25,
}

export const SCORE_WEIGHTS = {
  concept: 0.25,
  mastery: 0.40,
  retention: 0.20,
  volume: 0.15,
} as const

// ─── Pure Calculation Functions ───────────────────────────────────────────────

/**
 * Computes Concept score (0 - 100) from 1-5 rating.
 * 1 (Novice) -> 0%
 * 2 (Familiar) -> 25%
 * 3 (Comfortable) -> 50%
 * 4 (Proficient) -> 75%
 * 5 (Mastered) -> 100%
 */
export function calculateConceptScore(confidence: ConceptConfidence): number {
  const score = ((confidence - 1) / 4) * 100
  return Math.round(Math.max(0, Math.min(100, score)))
}

/**
 * Computes Practice Mastery score (0 - 100) from logged practice sessions.
 * Factors problem difficulty (Easy: 1.0, Medium: 2.0, Hard: 3.5)
 * and outcome (Solved: 1.0, Struggled: 0.5, Needed Help: 0.25)
 * relative to target problem quota.
 */
export function calculateMasteryScore(
  logs: PracticeLog[],
  targetQuota: number
): number {
  if (!logs || logs.length === 0 || targetQuota <= 0) {
    return 0
  }

  const earnedPoints = logs.reduce((total, log) => {
    const diffWeight = DIFFICULTY_WEIGHTS[log.difficulty] ?? 1.0
    const outMultiplier = OUTCOME_MULTIPLIERS[log.outcome] ?? 0.5
    return total + diffWeight * outMultiplier
  }, 0)

  // Target points are calibrated to targetQuota of standard Medium problems (weight 2.0)
  const targetPoints = targetQuota * 2.0
  const score = (earnedPoints / targetPoints) * 100

  return Math.round(Math.max(0, Math.min(100, score)))
}

/**
 * Computes Practice Volume score (0 - 100) from total problem count vs target quota.
 */
export function calculateVolumeScore(
  logsCount: number,
  targetQuota: number
): number {
  if (logsCount <= 0 || targetQuota <= 0) {
    return 0
  }
  const score = (logsCount / targetQuota) * 100
  return Math.round(Math.max(0, Math.min(100, score)))
}

/**
 * Computes the complete 4-factor Subtopic readiness breakdown.
 * Formula: R = (0.25 * C) + (0.40 * M) + (0.20 * D) + (0.15 * V)
 */
export function calculateSubtopicScore(
  subtopic: Subtopic,
  logs: PracticeLog[],
  retentionScore: number
): ScoreBreakdown {
  const conceptScore = calculateConceptScore(subtopic.conceptConfidence)
  const subtopicLogs = logs.filter((l) => l.subtopicId === subtopic.id)
  const masteryScore = calculateMasteryScore(
    subtopicLogs,
    subtopic.targetProblemQuota
  )
  const volumeScore = calculateVolumeScore(
    subtopicLogs.length,
    subtopic.targetProblemQuota
  )
  const clampedRetention = Math.round(
    Math.max(0, Math.min(100, retentionScore))
  )

  const rawReadiness =
    SCORE_WEIGHTS.concept * conceptScore +
    SCORE_WEIGHTS.mastery * masteryScore +
    SCORE_WEIGHTS.retention * clampedRetention +
    SCORE_WEIGHTS.volume * volumeScore

  const totalReadiness = Math.round(Math.max(0, Math.min(100, rawReadiness)))

  return {
    conceptScore,
    masteryScore,
    retentionScore: clampedRetention,
    volumeScore,
    totalReadiness,
  }
}

/**
 * Computes Topic Readiness as a weighted average of non-archived subtopic scores.
 */
export function calculateTopicScore(
  subtopics: Subtopic[],
  subtopicScores: Record<string, ScoreBreakdown>
): number {
  const active = subtopics.filter((s) => !s.isArchived)
  if (active.length === 0) return 0

  let totalWeightedScore = 0
  let totalWeight = 0

  for (const s of active) {
    const breakdown = subtopicScores[s.id]
    const readiness = breakdown ? breakdown.totalReadiness : 0
    const weight = Math.max(1, s.weight ?? 1)
    totalWeightedScore += readiness * weight
    totalWeight += weight
  }

  if (totalWeight === 0) return 0
  return Math.round(totalWeightedScore / totalWeight)
}

/**
 * Computes Category Readiness as the average of constituent topic readiness scores.
 */
export function calculateCategoryScore(topicScores: number[]): number {
  if (!topicScores || topicScores.length === 0) return 0
  const sum = topicScores.reduce((acc, score) => acc + score, 0)
  return Math.round(sum / topicScores.length)
}

/**
 * Computes Overall Readiness as the mean across all category readiness scores.
 */
export function calculateOverallScore(categoryScores: number[]): number {
  if (!categoryScores || categoryScores.length === 0) return 0
  const sum = categoryScores.reduce((acc, score) => acc + score, 0)
  return Math.round(sum / categoryScores.length)
}
