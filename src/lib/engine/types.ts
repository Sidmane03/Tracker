import type { Subtopic } from '@/types/domain'

export interface ScoreBreakdown {
  conceptScore: number      // 0 - 100 (25% weight)
  masteryScore: number      // 0 - 100 (40% weight)
  retentionScore: number    // 0 - 100 (20% weight)
  volumeScore: number       // 0 - 100 (15% weight)
  totalReadiness: number    // 0 - 100
}

export type SubtopicStatus =
  | 'Mastered'
  | 'Needs Practice'
  | 'Revision Due'
  | 'In Progress'
  | 'Untouched'

export interface SubtopicScoreDetail {
  subtopic: Subtopic
  scores: ScoreBreakdown
  status: SubtopicStatus
  isRevisionDue: boolean
}

export interface TopicScoreSummary {
  topicId: string
  readiness: number
  subtopicScores: Record<string, ScoreBreakdown>
}

export interface CategoryScoreSummary {
  categoryId: string
  readiness: number
  topicScores: Record<string, number>
}

export interface OverallScoreSummary {
  overallReadiness: number
  categoryScores: Record<string, number>
}
