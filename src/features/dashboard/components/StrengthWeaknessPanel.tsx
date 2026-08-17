import React from 'react'
import { Card } from '@/components/ui'
import { getTopStrengths, getTopWeaknesses } from '@/lib/engine'
import { useStore } from '@/store'
import type { ScoreBreakdown } from '@/lib/engine'
import type { Subtopic } from '@/types/domain'

interface StrengthWeaknessPanelProps {
  subtopicList: Subtopic[]
  scores: Record<string, ScoreBreakdown>
  onOpenQuickLog?: (subtopicId: string) => void
  onInspectSubtopic?: (subtopicId: string) => void
}

export const StrengthWeaknessPanel: React.FC<StrengthWeaknessPanelProps> = ({
  subtopicList,
  scores,
  onInspectSubtopic,
}) => {
  const { categories, topics } = useStore()

  const strengths = getTopStrengths(subtopicList, scores, categories, topics, 3)
  const weaknesses = getTopWeaknesses(subtopicList, scores, categories, topics, 3)

  const handleKeyDown = (e: React.KeyboardEvent, subtopicId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onInspectSubtopic?.(subtopicId)
    }
  }

  return (
    <Card className="rounded-[20px] border border-white/[0.08] bg-[#10192b] p-5 sm:p-6 h-full flex flex-col justify-between">
      <div>
        <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--text-muted)] uppercase">
          Pattern check
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
          Strengths &amp; weaknesses
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* ── Left Column: Your Strengths */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#9be0af]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1f4636] text-[11px] font-bold">
                ✓
              </span>
              <span>Your strengths</span>
            </div>

            <div className="space-y-0.5">
              {strengths.length === 0 ? (
                <p className="py-6 text-xs text-[var(--text-muted)] text-center">
                  Log practice sessions to discover your top strengths.
                </p>
              ) : (
                strengths.map(({ subtopic, readiness, categoryTitle }) => (
                  <div
                    key={subtopic.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onInspectSubtopic?.(subtopic.id)}
                    onKeyDown={(e) => handleKeyDown(e, subtopic.id)}
                    className="flex items-center justify-between border-b border-white/[0.07] py-3 cursor-pointer group hover:bg-white/[0.03] px-1.5 rounded transition"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-light)] transition-colors truncate">
                        {subtopic.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#8190aa] truncate">
                        {categoryTitle}
                      </p>
                    </div>
                    <span className="mono text-sm font-semibold text-[#9be0af] flex-shrink-0">
                      {readiness}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Right Column: Needs Attention */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#ffd193]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#4b3a23] text-[11px] font-bold">
                !
              </span>
              <span>Needs attention</span>
            </div>

            <div className="space-y-0.5">
              {weaknesses.length === 0 ? (
                <p className="py-6 text-xs text-[var(--text-muted)] text-center">
                  No critical weakness areas flagged right now.
                </p>
              ) : (
                weaknesses.map(({ subtopic, readiness, categoryTitle }) => (
                  <div
                    key={subtopic.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onInspectSubtopic?.(subtopic.id)}
                    onKeyDown={(e) => handleKeyDown(e, subtopic.id)}
                    className="flex items-center justify-between border-b border-white/[0.07] py-3 cursor-pointer group hover:bg-white/[0.03] px-1.5 rounded transition"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-light)] transition-colors truncate">
                        {subtopic.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#8190aa] truncate">
                        {categoryTitle}
                      </p>
                    </div>
                    <span className="mono text-sm font-semibold text-[#ffd193] flex-shrink-0">
                      {readiness}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
