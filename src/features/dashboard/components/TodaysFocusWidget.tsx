import React from 'react'
import { Card } from '@/components/ui'
import { getRecommendedTopics } from '@/lib/engine'
import { useStore } from '@/store'
import type { ScoreBreakdown } from '@/lib/engine'
import type { Subtopic } from '@/types/domain'

interface TodaysFocusWidgetProps {
  subtopicList: Subtopic[]
  scores: Record<string, ScoreBreakdown>
  onOpenQuickLog?: (subtopicId: string) => void
  onInspectSubtopic?: (subtopicId: string) => void
}

export const TodaysFocusWidget: React.FC<TodaysFocusWidgetProps> = ({
  subtopicList,
  scores,
  onOpenQuickLog,
  onInspectSubtopic,
}) => {
  const { categories, topics, careerRoles, preferences } = useStore()

  const primaryRole = careerRoles.find((r) => r.id === preferences.primaryCareerTarget)
  const recommendations = getRecommendedTopics(subtopicList, scores, categories, topics, primaryRole, 3)

  if (recommendations.length === 0) {
    return (
      <Card className="rounded-[20px] border border-white/[0.08] bg-[var(--surface-1)] p-5">
        <p className="text-xs text-[var(--text-muted)]">No focus recommendations right now. Great job!</p>
      </Card>
    )
  }

  return (
    <section>
      {/* ── Section Header matching Figma */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--text-muted)] uppercase">
            Recommended next
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Today&rsquo;s focus
          </h2>
        </div>
        <span className="hidden text-xs text-[var(--text-muted)] sm:block">
          Pick one and make it count.
        </span>
      </div>

      {/* ── 3-Card Deck matching Figma */}
      <div className="grid gap-3.5 lg:grid-cols-3">
        {recommendations.map(({ subtopic, readiness, categoryTitle, reason }) => {
          const isDecayed = reason.includes('Revision Due')
          const isRoleGap = reason.includes('Career') || reason.includes('Target')
          const isCoreGap = reason.includes('Critical') || reason.includes('Gap')

          const tone = isCoreGap ? 'rose' : isDecayed ? 'amber' : 'indigo'

          // Actionable context note
          let note = 'Start with a 15 min concept refresh, then solve 2 checks.'
          if (isDecayed && subtopic.lastPracticedAt) {
            const daysAgo = Math.max(1, Math.round((Date.now() - subtopic.lastPracticedAt) / (1000 * 60 * 60 * 24)))
            note = `Your last practice was ${daysAgo} day${daysAgo === 1 ? '' : 's'} ago. Refresh retention before it decays.`
          } else if (isRoleGap && primaryRole) {
            note = `High impact skill area for your target role: ${primaryRole.title}.`
          } else if (subtopic.targetProblemQuota) {
            note = `Target quota: ${subtopic.targetProblemQuota} problems. Practice now to build confidence.`
          }

          const badgeStyles =
            tone === 'rose'
              ? 'bg-[#4b2839] text-[#ffafc8]'
              : tone === 'amber'
              ? 'bg-[#493b2b] text-[#ffd092]'
              : 'bg-[#283360] text-[#b7bcff]'

          return (
            <article
              key={subtopic.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[18px] border border-white/[0.1] bg-[#10192b] p-5 transition hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[#131e34]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeStyles}`}>
                    {reason}
                  </span>
                  <span className="mono text-xs font-semibold text-[#aeb9d3]">
                    {readiness}%
                  </span>
                </div>

                <p className="mt-5 text-[11px] font-bold tracking-[0.12em] text-[#8290aa] uppercase">
                  {categoryTitle}
                </p>

                <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#f2f5ff] group-hover:text-[var(--accent-light)] transition-colors">
                  {subtopic.title}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-[#91a0b9]">
                  {note}
                </p>
              </div>

              {/* ── Action buttons */}
              <div className="mt-5 flex items-center gap-2 pt-2 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => onOpenQuickLog?.(subtopic.id)}
                  className="rounded-lg bg-[#7c83ff] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#8d93ff] cursor-pointer shadow-[0_4px_12px_rgba(124,131,255,.2)]"
                >
                  Start practice
                </button>
                <button
                  type="button"
                  onClick={() => onInspectSubtopic?.(subtopic.id)}
                  className="rounded-lg px-2.5 py-2 text-xs font-semibold text-[#b7c1da] hover:text-white transition cursor-pointer"
                >
                  Details →
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
