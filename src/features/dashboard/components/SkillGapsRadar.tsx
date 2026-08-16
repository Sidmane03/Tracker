import React from 'react'
import { AlertOctagon, Zap } from 'lucide-react'
import { getCriticalSkillGaps } from '@/lib/engine'
import { useStore } from '@/store'
import type { ScoreBreakdown } from '@/lib/engine'

interface SkillGapsRadarProps {
  onOpenQuickLog?: (subtopicId: string) => void
}

export const SkillGapsRadar: React.FC<SkillGapsRadarProps> = ({
  onOpenQuickLog,
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
    <div
      className="p-4 rounded-[var(--radius-lg)] border border-[var(--border)]"
      style={{
        background: 'linear-gradient(180deg, var(--surface-1) 0%, var(--surface-2) 100%)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[var(--danger-subtle)] text-[var(--danger)]">
            <AlertOctagon size={16} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">
              Critical Skill Gaps
            </h3>
            <p className="text-[10px] text-[var(--text-muted)]">
              High interview priority topics requiring immediate preparation
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {gaps.map(({ subtopic, readiness, categoryTitle, topicTitle }) => (
          <div
            key={subtopic.id}
            className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--danger-subtle)] text-[var(--danger)] font-medium">
                  Weight &times;{subtopic.weight || 2} Priority
                </span>
                <span className="text-xs font-mono font-bold text-[var(--danger)]">
                  {readiness}%
                </span>
              </div>
              <h4 className="text-xs font-semibold text-[var(--text-primary)] truncate">
                {subtopic.title}
              </h4>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate">
                {categoryTitle} &bull; {topicTitle}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)]">
                Target: {subtopic.targetProblemQuota} problems
              </span>
              {onOpenQuickLog && (
                <button
                  onClick={() => onOpenQuickLog(subtopic.id)}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--accent-light)] hover:text-white transition-colors cursor-pointer"
                >
                  <Zap size={11} />
                  <span>Start Practice</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
