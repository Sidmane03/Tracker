import React from 'react'
import { Card } from '@/components/ui'
import { getCriticalSkillGaps } from '@/lib/engine'
import { useStore } from '@/store'
import type { ScoreBreakdown } from '@/lib/engine'

interface SkillGapsRadarProps {
  onOpenQuickLog?: (subtopicId: string) => void
  onInspectSubtopic?: (subtopicId: string) => void
}

export const SkillGapsRadar: React.FC<SkillGapsRadarProps> = ({
  onInspectSubtopic,
}) => {
  const { subtopics, categories, topics, getSubtopicReadiness } = useStore()

  const subtopicList = Object.values(subtopics)

  const scores: Record<string, ScoreBreakdown> = {}
  for (const s of subtopicList) {
    scores[s.id] = getSubtopicReadiness(s.id)
  }

  const gaps = getCriticalSkillGaps(subtopicList, scores, categories, topics, 4)

  if (gaps.length === 0) return null

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-[var(--danger)] opacity-80" />
        <h3 className="text-xs font-semibold text-[var(--text-primary)]">
          Critical Skill Gaps
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {gaps.map(({ subtopic, readiness }) => (
          <div
            key={subtopic.id}
            onClick={() => onInspectSubtopic?.(subtopic.id)}
            className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="min-w-0 flex-1 pr-3">
              <h4 className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-light)] transition-colors truncate">
                {subtopic.title}
              </h4>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-mono font-medium text-[var(--danger)]">
                {readiness}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
