import { useMemo } from 'react'
import { useStore } from '@/store'
import type { ScoreBreakdown } from '@/lib/engine'
import type { Subtopic } from '@/types/domain'

interface DashboardScores {
  subtopicList: Subtopic[]
  scores: Record<string, ScoreBreakdown>
}

/**
 * Computes all subtopic readiness scores once for the entire dashboard.
 *
 * Previously, every dashboard widget independently ran:
 *   const subtopicList = Object.values(subtopics)
 *   for (const s of subtopicList) { scores[s.id] = getSubtopicReadiness(s.id) }
 *
 * This hook centralizes that computation so it is performed once in DashboardPage
 * and the results are passed down as props to child widgets.
 */
export function useDashboardScores(): DashboardScores {
  const subtopics = useStore((s) => s.subtopics)
  const getSubtopicReadiness = useStore((s) => s.getSubtopicReadiness)

  return useMemo(() => {
    const subtopicList = Object.values(subtopics)
    const scores: Record<string, ScoreBreakdown> = {}
    for (const s of subtopicList) {
      scores[s.id] = getSubtopicReadiness(s.id)
    }
    return { subtopicList, scores }
  }, [subtopics, getSubtopicReadiness])
}
