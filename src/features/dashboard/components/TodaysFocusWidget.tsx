import React from 'react'
import { Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/'
import { getRecommendedTopics } from '@/lib/engine'
import { useStore } from '@/store'
import type { ScoreBreakdown } from '@/lib/engine'

interface TodaysFocusWidgetProps {
  onOpenQuickLog?: (subtopicId: string) => void
  onInspectSubtopic?: (subtopicId: string) => void
}

export const TodaysFocusWidget: React.FC<TodaysFocusWidgetProps> = ({
  onInspectSubtopic,
}) => {
  const { subtopics, categories, topics, careerRoles, preferences, getSubtopicReadiness } = useStore()

  const subtopicList = Object.values(subtopics)
  const scores: Record<string, ScoreBreakdown> = {}
  for (const s of subtopicList) {
    scores[s.id] = getSubtopicReadiness(s.id)
  }

  const primaryRole = careerRoles.find((r) => r.id === preferences.primaryCareerTarget)
  const recommendations = getRecommendedTopics(subtopicList, scores, categories, topics, primaryRole, 3)

  if (recommendations.length === 0) {
    return (
      <Card>
        <p className="text-xs text-[var(--text-muted)]">No data.</p>
      </Card>
    )
  }

  return (
    <Card className="space-y-3.5">
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-[var(--text-muted)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
          Today's Recommended Focus
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map(({ subtopic, readiness, reason }) => {
          const isDecayed = reason.includes('Revision Due')
          const isRoleGap = reason.includes('Career')

          const dotColor = isDecayed
            ? 'var(--warning)'
            : isRoleGap
            ? 'var(--accent-light)'
            : 'var(--danger)'

          return (
            <div
              key={subtopic.id}
              onClick={() => onInspectSubtopic?.(subtopic.id)}
              className="p-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: dotColor }}
                  />
                  <span className="text-xs font-mono font-medium text-[var(--text-primary)]">
                    {readiness}%
                  </span>
                </div>

                <h4 className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-light)] transition-colors truncate">
                  {subtopic.title}
                </h4>
              </div>

              {/* Minimal Horizontal Progress Bar */}
              <div className="mt-4">
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 3, background: 'var(--surface-3)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${readiness}%`,
                      background: dotColor,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
