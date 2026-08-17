import React, { useState } from 'react'
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
  const [selectedFocus, setSelectedFocus] = useState<number>(0)

  const primaryRole = careerRoles.find((r) => r.id === preferences.primaryCareerTarget)
  const recommendations = getRecommendedTopics(subtopicList, scores, categories, topics, primaryRole, 3)

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className="mb-9">
      {/* ── Section Header matching Figma Image 1 */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#8c98b1] uppercase">
            Recommended next
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
            Today’s focus
          </h2>
        </div>
        <span className="hidden text-xs text-[#8290aa] sm:block">
          Pick one and make it count.
        </span>
      </div>

      {/* ── 3 Focus Cards matching Figma Image 1 */}
      <div className="grid gap-3 lg:grid-cols-3">
        {recommendations.map(({ subtopic, readiness, categoryTitle, reason }, index) => {
          const isDecayed = reason.includes('Revision Due')
          const isRoleGap = reason.includes('Career') || reason.includes('Target')
          const isCoreGap = reason.includes('Critical') || reason.includes('Gap')

          const tone = isCoreGap ? 'rose' : isDecayed ? 'amber' : 'indigo'
          const label = isCoreGap ? 'Critical gap' : isDecayed ? 'Revision due' : 'High priority'

          let note = 'Start with a 20 min concept refresh, then solve 2 checks.'
          if (isDecayed && subtopic.lastPracticedAt) {
            const daysAgo = Math.max(1, Math.round((Date.now() - subtopic.lastPracticedAt) / (1000 * 60 * 60 * 24)))
            note = `Your last practice was ${daysAgo} days ago.`
          } else if (isRoleGap && primaryRole) {
            note = `Strengthen this for your ${primaryRole.title} target.`
          }

          const isSelected = selectedFocus === index

          return (
            <article
              key={subtopic.id}
              onClick={() => setSelectedFocus(index)}
              className={`group relative overflow-hidden rounded-[18px] border p-5 transition cursor-pointer ${
                isSelected
                  ? 'border-[#858cff]/55 bg-[#192343] shadow-[0_12px_26px_rgba(0,0,0,.18)]'
                  : 'border-white/[0.1] bg-[#10192b] hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[#131e34]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    tone === 'rose'
                      ? 'bg-[#4b2839] text-[#ffafc8]'
                      : tone === 'amber'
                      ? 'bg-[#493b2b] text-[#ffd092]'
                      : 'bg-[#283360] text-[#b7bcff]'
                  }`}
                >
                  {label}
                </span>
                <span className="mono text-xs text-[#aeb9d3]">
                  {readiness}%
                </span>
              </div>

              <p className="mt-5 text-[11px] font-bold tracking-[0.12em] text-[#8290aa] uppercase">
                {categoryTitle}
              </p>

              <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white">
                {subtopic.title}
              </h3>

              <p className="mt-2 min-h-10 text-sm leading-5 text-[#91a0b9]">
                {note}
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenQuickLog?.(subtopic.id)
                  }}
                  className="rounded-lg bg-[#7c83ff] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#8d93ff] cursor-pointer"
                >
                  Start practice
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onInspectSubtopic?.(subtopic.id)
                  }}
                  className="rounded-lg px-2 py-2 text-xs font-semibold text-[#b7c1da] hover:text-white cursor-pointer"
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
