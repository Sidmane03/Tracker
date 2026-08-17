import React from 'react'
import { Card } from '@/components/ui'
import { getTopStrengths, getTopWeaknesses } from '@/lib/engine'
import { useStore } from '@/store'
import type { ScoreBreakdown } from '@/lib/engine'

interface StrengthWeaknessPanelProps {
  onOpenQuickLog?: (subtopicId: string) => void
  onInspectSubtopic?: (subtopicId: string) => void
}

export const StrengthWeaknessPanel: React.FC<StrengthWeaknessPanelProps> = ({
  onInspectSubtopic,
}) => {
  const { subtopics, categories, topics, getSubtopicReadiness } = useStore()

  const subtopicList = Object.values(subtopics)

  const scores: Record<string, ScoreBreakdown> = {}
  for (const s of subtopicList) {
    scores[s.id] = getSubtopicReadiness(s.id)
  }

  const strengths = getTopStrengths(subtopicList, scores, categories, topics, 3)
  const weaknesses = getTopWeaknesses(subtopicList, scores, categories, topics, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* ── Top Strengths */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] opacity-80" />
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">
              Top Strengths
            </h3>
          </div>

          <div className="space-y-2.5">
            {strengths.length === 0 ? (
              <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                No data.
              </div>
            ) : (
              strengths.map(({ subtopic, readiness }) => (
                <div
                  key={subtopic.id}
                  onClick={() => onInspectSubtopic?.(subtopic.id)}
                  className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all cursor-pointer group"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-light)] transition-colors truncate">
                      {subtopic.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-mono font-medium text-[var(--success)]">
                      {readiness}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* ── Growth Areas */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--warning)] opacity-80" />
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">
              Focus &amp; Growth Areas
            </h3>
          </div>

          <div className="space-y-2.5">
            {weaknesses.length === 0 ? (
              <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                No data.
              </div>
            ) : (
              weaknesses.map(({ subtopic, readiness }) => (
                <div
                  key={subtopic.id}
                  onClick={() => onInspectSubtopic?.(subtopic.id)}
                  className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all cursor-pointer group"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-light)] transition-colors truncate">
                      {subtopic.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-mono font-medium text-[var(--warning)]">
                      {readiness}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
