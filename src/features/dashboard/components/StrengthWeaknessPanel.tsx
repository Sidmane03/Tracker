import React from 'react'
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

  return (
    <div className="rounded-[20px] border border-white/[0.08] bg-[#10192b] p-5 sm:p-6">
      <p className="text-[11px] font-bold tracking-[0.14em] text-[#8c98b1] uppercase">
        Pattern check
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
        Strengths &amp; weaknesses
      </h2>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {/* ── Left Column: Your strengths */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#9be0af]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1f4636] text-[11px] font-bold">
              ✓
            </span>
            <span>Your strengths</span>
          </div>

          <div>
            {strengths.length === 0 ? (
              <p className="py-6 text-xs text-[#8190aa]">Log practice sessions to discover your top strengths.</p>
            ) : (
              strengths.map(({ subtopic, readiness, categoryTitle }) => (
                <div
                  key={subtopic.id}
                  onClick={() => onInspectSubtopic?.(subtopic.id)}
                  className="flex items-center justify-between border-b border-white/[0.07] py-3 cursor-pointer group hover:bg-white/[0.02] transition"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-medium text-white group-hover:text-[#9be0af] transition truncate">
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

        {/* ── Right Column: Needs attention */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#ffd193]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#4b3a23] text-[11px] font-bold">
              !
            </span>
            <span>Needs attention</span>
          </div>

          <div>
            {weaknesses.length === 0 ? (
              <p className="py-6 text-xs text-[#8190aa]">No critical weakness areas flagged right now.</p>
            ) : (
              weaknesses.map(({ subtopic, readiness, categoryTitle }) => (
                <div
                  key={subtopic.id}
                  onClick={() => onInspectSubtopic?.(subtopic.id)}
                  className="flex items-center justify-between border-b border-white/[0.07] py-3 cursor-pointer group hover:bg-white/[0.02] transition"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-medium text-white group-hover:text-[#ffd193] transition truncate">
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
  )
}
