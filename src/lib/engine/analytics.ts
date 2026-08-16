import type {
  AppState,
  Category,
  Subtopic,
  Topic,
} from '@/types/domain'
import type { ScoreBreakdown } from './types'

export interface RankedSubtopic {
  subtopic: Subtopic
  readiness: number
  categoryTitle: string
  topicTitle: string
  categoryColor: string
}

export interface DashboardMetrics {
  totalProblems: number
  totalStudyHours: string
  activeSubtopicsCount: number
  masteredCount: number
  averageAccuracy: number | null
}

/**
 * Returns Top Strengths (highest readiness scores, >= 50% or top non-zero).
 */
export function getTopStrengths(
  subtopics: Subtopic[],
  scores: Record<string, ScoreBreakdown>,
  categories: Record<string, Category>,
  topics: Record<string, Topic>,
  limit = 3
): RankedSubtopic[] {
  const active = subtopics.filter((s) => !s.isArchived)

  const ranked: RankedSubtopic[] = []

  for (const s of active) {
    const breakdown = scores[s.id]
    const readiness = breakdown ? breakdown.totalReadiness : 0
    if (readiness <= 0) continue

    const topic = topics[s.topicId]
    const category = categories[s.categoryId]

    ranked.push({
      subtopic: s,
      readiness,
      categoryTitle: category?.title || 'General',
      topicTitle: topic?.title || 'General',
      categoryColor: category?.color || 'cat-blue',
    })
  }

  // Sort descending by readiness, then descending by weight
  ranked.sort((a, b) => {
    if (b.readiness !== a.readiness) {
      return b.readiness - a.readiness
    }
    return (b.subtopic.weight || 1) - (a.subtopic.weight || 1)
  })

  return ranked.slice(0, limit)
}

/**
 * Returns Top Weaknesses / Needs Attention subtopics (lowest readiness among touched topics).
 */
export function getTopWeaknesses(
  subtopics: Subtopic[],
  scores: Record<string, ScoreBreakdown>,
  categories: Record<string, Category>,
  topics: Record<string, Topic>,
  limit = 3
): RankedSubtopic[] {
  const active = subtopics.filter((s) => !s.isArchived)

  const ranked: RankedSubtopic[] = []

  for (const s of active) {
    const breakdown = scores[s.id]
    const readiness = breakdown ? breakdown.totalReadiness : 0
    // Include topics where user has either rated confidence > 1 or practiced, but readiness < 70
    const hasInitiated = (s.conceptConfidence && s.conceptConfidence > 1) || (breakdown && breakdown.masteryScore > 0)
    if (!hasInitiated || readiness >= 70) continue

    const topic = topics[s.topicId]
    const category = categories[s.categoryId]

    ranked.push({
      subtopic: s,
      readiness,
      categoryTitle: category?.title || 'General',
      topicTitle: topic?.title || 'General',
      categoryColor: category?.color || 'cat-blue',
    })
  }

  // Sort ascending by readiness, then descending by weight
  ranked.sort((a, b) => {
    if (a.readiness !== b.readiness) {
      return a.readiness - b.readiness
    }
    return (b.subtopic.weight || 1) - (a.subtopic.weight || 1)
  })

  return ranked.slice(0, limit)
}

/**
 * Returns Critical Skill Gaps (High importance weight >= 2 with readiness < 40%).
 */
export function getCriticalSkillGaps(
  subtopics: Subtopic[],
  scores: Record<string, ScoreBreakdown>,
  categories: Record<string, Category>,
  topics: Record<string, Topic>,
  limit = 4
): RankedSubtopic[] {
  const active = subtopics.filter((s) => !s.isArchived && (s.weight ?? 1) >= 2)

  const ranked: RankedSubtopic[] = []

  for (const s of active) {
    const breakdown = scores[s.id]
    const readiness = breakdown ? breakdown.totalReadiness : 0
    if (readiness >= 40) continue

    const topic = topics[s.topicId]
    const category = categories[s.categoryId]

    ranked.push({
      subtopic: s,
      readiness,
      categoryTitle: category?.title || 'General',
      topicTitle: topic?.title || 'General',
      categoryColor: category?.color || 'cat-blue',
    })
  }

  // Sort by gap impact: weight * (100 - readiness)
  ranked.sort((a, b) => {
    const impactA = (a.subtopic.weight || 1) * (100 - a.readiness)
    const impactB = (b.subtopic.weight || 1) * (100 - b.readiness)
    return impactB - impactA
  })

  return ranked.slice(0, limit)
}

/**
 * Computes high-level aggregated metrics for the executive dashboard.
 */
export function getDashboardSummaryMetrics(
  state: AppState,
  scores: Record<string, ScoreBreakdown>
): DashboardMetrics {
  const totalProblems = state.practiceLogs.length
  const totalMinutes = state.practiceLogs.reduce(
    (acc, l) => acc + (l.timeSpentMinutes || 0),
    0
  )
  const totalStudyHours = (totalMinutes / 60).toFixed(1)

  const subtopicsList = Object.values(state.subtopics).filter((s) => !s.isArchived)
  let activeSubtopicsCount = 0
  let masteredCount = 0

  for (const s of subtopicsList) {
    const breakdown = scores[s.id]
    const readiness = breakdown ? breakdown.totalReadiness : 0
    const hasActivity = s.conceptConfidence > 1 || (breakdown && breakdown.masteryScore > 0)
    if (hasActivity) {
      activeSubtopicsCount++
    }
    if (readiness >= 80) {
      masteredCount++
    }
  }

  const accuracyLogs = state.practiceLogs.filter((l) => l.accuracyPercent !== undefined)
  const averageAccuracy =
    accuracyLogs.length > 0
      ? Math.round(
          accuracyLogs.reduce((acc, l) => acc + (l.accuracyPercent || 0), 0) /
            accuracyLogs.length
        )
      : null

  return {
    totalProblems,
    totalStudyHours,
    activeSubtopicsCount,
    masteredCount,
    averageAccuracy,
  }
}
