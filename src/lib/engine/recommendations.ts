import type {
  CareerRole,
  Category,
  Subtopic,
  Topic,
} from '@/types/domain'
import type { ScoreBreakdown } from './types'

export interface RecommendedTopic {
  subtopic: Subtopic
  priorityScore: number
  readiness: number
  retentionScore: number
  categoryTitle: string
  topicTitle: string
  categoryColor: string
  reason: string
}

/**
 * Calculates raw numerical priority score for study recommendation.
 * Formula: Deficit * Importance * DecayBoost * RoleBoost
 */
export function calculatePriorityScore(
  readiness: number,
  weight: number,
  retentionScore: number,
  careerWeight = 1.0
): number {
  const deficit = Math.max(0, 100 - readiness)
  const importanceMultiplier = Math.max(1, weight || 1)

  // Decay boost: heavy boost if retention dropped below 50%
  const decayMultiplier =
    retentionScore < 50 ? 1.6 : retentionScore < 70 ? 1.25 : 1.0

  // Role boost: if category is vital for targeted career role (e.g. 0.35 weight)
  const roleMultiplier = Math.max(0.6, careerWeight * 2.5)

  const raw = deficit * importanceMultiplier * decayMultiplier * roleMultiplier
  return Math.round(raw)
}

/**
 * Determines a human-readable rationale reason for why this topic was recommended.
 */
function getRecommendationReason(
  readiness: number,
  retentionScore: number,
  weight: number,
  careerWeight: number
): string {
  if (retentionScore < 50 && readiness >= 10) {
    return 'Revision Due — Retention decayed'
  }
  if (careerWeight >= 0.25) {
    return 'High Career Target Priority'
  }
  if (weight >= 3 && readiness < 40) {
    return 'Critical Core Skill Gap'
  }
  if (readiness >= 40 && readiness < 75) {
    return 'In Progress — Ready for Mastery'
  }
  return 'High Impact Growth Area'
}

/**
 * Returns prioritized daily study recommendations.
 */
export function getRecommendedTopics(
  subtopics: Subtopic[],
  scores: Record<string, ScoreBreakdown>,
  categories: Record<string, Category>,
  topics: Record<string, Topic>,
  primaryCareerRole?: CareerRole,
  limit = 4
): RecommendedTopic[] {
  const active = subtopics.filter((s) => !s.isArchived)

  const ranked: RecommendedTopic[] = []

  for (const s of active) {
    const breakdown = scores[s.id]
    const readiness = breakdown ? breakdown.totalReadiness : 0
    const retentionScore = breakdown ? breakdown.retentionScore : 0

    // Filter out fully mastered topics (readiness >= 90 with healthy retention >= 75)
    if (readiness >= 90 && retentionScore >= 75) continue

    const category = categories[s.categoryId]
    const topic = topics[s.topicId]

    const careerWeight =
      primaryCareerRole?.categoryWeights[s.categoryId] ?? 0.15

    const priorityScore = calculatePriorityScore(
      readiness,
      s.weight ?? 1,
      retentionScore,
      careerWeight
    )

    const reason = getRecommendationReason(
      readiness,
      retentionScore,
      s.weight ?? 1,
      careerWeight
    )

    ranked.push({
      subtopic: s,
      priorityScore,
      readiness,
      retentionScore,
      categoryTitle: category?.title || 'General',
      topicTitle: topic?.title || 'General',
      categoryColor: category?.color || 'cat-blue',
      reason,
    })
  }

  // Sort descending by priorityScore
  ranked.sort((a, b) => b.priorityScore - a.priorityScore)

  return ranked.slice(0, limit)
}
