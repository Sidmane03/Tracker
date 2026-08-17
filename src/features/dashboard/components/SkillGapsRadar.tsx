import React from 'react'
import { Card } from '@/components/ui'
import { getCriticalSkillGaps } from '@/lib/engine'
import { useStore } from '@/store'
import type { ScoreBreakdown } from '@/lib/engine'
import type { Subtopic } from '@/types/domain'

interface SkillGapsRadarProps {
  subtopicList: Subtopic[]
  scores: Record<string, ScoreBreakdown>
  onOpenQuickLog?: (subtopicId: string) => void
  onInspectSubtopic?: (subtopicId: string) => void
  onNavigateToSkills?: () => void
}

export const SkillGapsRadar: React.FC<SkillGapsRadarProps> = ({
  subtopicList,
  scores,
  onOpenQuickLog,
  onInspectSubtopic,
  onNavigateToSkills,
}) => {
  const { categories, topics } = useStore()

  const gaps = getCriticalSkillGaps(subtopicList, scores, categories, topics, 4)

  return (
    <Card className="rounded-[20px] border border-white/[0.08] bg-[#10192b] p-5 sm:p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--text-muted)] uppercase">
              Act next
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
              Priority gaps
            </h2>
          </div>
          {gaps.length > 0 && (
            <span className="rounded-full bg-[#293354] px-2.5 py-1 text-[11px] font-bold text-[#c0c7ff]">
              {gaps.length} to address
            </span>
          )}
        </div>

        <p className="mt-2 text-sm leading-5 text-[#8795af]">
          Small, specific actions to improve your career readiness.
        </p>

        <div className="mt-4 space-y-1">
          {gaps.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No critical skill gaps detected. You are in great shape!
            </div>
          ) : (
            gaps.map(({ subtopic, categoryTitle }) => {
              const priority =
                (subtopic.weight ?? 1) >= 3 ? 'Critical' : (subtopic.weight ?? 1) === 2 ? 'High' : 'Medium'
              const dotColor =
                priority === 'Critical'
                  ? 'bg-[#ed8ca7]'
                  : priority === 'High'
                  ? 'bg-[#f4bd78]'
                  : 'bg-[#75bfff]'

              return (
                <div
                  key={subtopic.id}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-white/[0.045]"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onInspectSubtopic?.(subtopic.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onInspectSubtopic?.(subtopic.id)
                      }
                    }}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <p className="truncate text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-light)] transition-colors">
                      {subtopic.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#8190aa]">
                      {categoryTitle} &bull; {priority} priority
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenQuickLog?.(subtopic.id)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#adb4ff] transition hover:bg-[#2a335d] hover:text-white cursor-pointer flex-shrink-0"
                  >
                    Log
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-white/[0.05]">
        <button
          type="button"
          onClick={onNavigateToSkills}
          className="text-xs font-bold text-[#aab0ff] hover:text-white transition cursor-pointer"
        >
          Review all gaps →
        </button>
      </div>
    </Card>
  )
}
