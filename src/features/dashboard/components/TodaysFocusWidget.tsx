import React from 'react'
import { Sparkles, Zap, Info } from 'lucide-react'
import { getRecommendedTopics } from '@/lib/engine'
import { useStore } from '@/store'
import type { ScoreBreakdown } from '@/lib/engine'

interface TodaysFocusWidgetProps {
  onOpenQuickLog?: (subtopicId: string) => void
  onInspectSubtopic?: (subtopicId: string) => void
}

export const TodaysFocusWidget: React.FC<TodaysFocusWidgetProps> = ({
  onOpenQuickLog,
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

  if (recommendations.length === 0) return null

  return (
    <div
      className="p-5 rounded-[var(--radius-xl)] border border-[var(--border)] relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%)',
        borderLeft: '4px solid var(--accent)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent-light)]">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Today&rsquo;s Recommended Focus
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)]">
              High-priority topics chosen based on score deficit, forgetting curves, and target career alignment
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.map(({ subtopic, priorityScore, readiness, categoryTitle, topicTitle, reason }) => {
          const isDecayed = reason.includes('Revision Due')

          return (
            <div
              key={subtopic.id}
              className="p-3.5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--accent)]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Reason badge */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isDecayed
                        ? 'bg-[var(--warning-subtle)] text-[var(--warning)] border-[var(--warning)]/30'
                        : 'bg-[var(--accent-subtle)] text-[var(--accent-light)] border-[var(--accent)]/30'
                    }`}
                  >
                    {reason}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]" title="Heuristic Priority Score">
                    Score: {priorityScore}
                  </span>
                </div>

                {/* Subtopic Title */}
                <h4 className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-light)] transition-colors">
                  {subtopic.title}
                </h4>
                <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                  {categoryTitle} &bull; {topicTitle}
                </p>

                {/* Readiness Progress */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-[var(--text-secondary)]">Readiness:</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">{readiness}%</span>
                  </div>
                  <div
                    className="w-full rounded-full overflow-hidden"
                    style={{ height: 4, background: 'var(--surface-3)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${readiness}%`,
                        background: readiness >= 60 ? 'var(--success)' : readiness >= 35 ? 'var(--accent)' : 'var(--warning)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-2.5 border-t border-[var(--border)] flex items-center justify-between">
                <button
                  onClick={() => onInspectSubtopic?.(subtopic.id)}
                  className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                >
                  <Info size={12} />
                  <span>Inspect</span>
                </button>

                {onOpenQuickLog && (
                  <button
                    onClick={() => onOpenQuickLog(subtopic.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-sm)] text-[11px] font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] transition-all shadow-[0_0_10px_var(--accent-glow)] cursor-pointer"
                  >
                    <Zap size={12} />
                    <span>Log Practice</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
