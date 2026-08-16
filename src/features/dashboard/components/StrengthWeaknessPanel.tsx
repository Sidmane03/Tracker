import React from 'react'
import { AlertTriangle, Plus, CheckCircle2 } from 'lucide-react'
import { getTopStrengths, getTopWeaknesses } from '@/lib/engine'
import { useStore } from '@/store'
import type { ScoreBreakdown } from '@/lib/engine'

interface StrengthWeaknessPanelProps {
  onOpenQuickLog?: (subtopicId: string) => void
}

export const StrengthWeaknessPanel: React.FC<StrengthWeaknessPanelProps> = ({
  onOpenQuickLog,
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ── Top Strengths Card */}
      <div
        className="p-4 rounded-[var(--radius-lg)] border border-[var(--border)]"
        style={{ background: 'var(--surface-1)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-md bg-[var(--success-subtle)] text-[var(--success)]">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">
              Top Strengths
            </h3>
            <p className="text-[10px] text-[var(--text-muted)]">
              Highest scoring areas with proven mastery
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {strengths.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-4 text-center">
              No strong topics recorded yet. Start practicing to build readiness!
            </p>
          ) : (
            strengths.map(({ subtopic, readiness, categoryTitle, topicTitle }) => (
              <div
                key={subtopic.id}
                className="flex items-center justify-between p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] group"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {subtopic.title}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate">
                    {categoryTitle} &bull; {topicTitle}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-mono font-bold text-[var(--success)]">
                    {readiness}%
                  </span>
                  {onOpenQuickLog && (
                    <button
                      onClick={() => onOpenQuickLog(subtopic.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-[var(--accent-light)] transition-all cursor-pointer"
                      title="Log more practice"
                    >
                      <Plus size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Top Weaknesses / Attention Needed */}
      <div
        className="p-4 rounded-[var(--radius-lg)] border border-[var(--border)]"
        style={{ background: 'var(--surface-1)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-md bg-[var(--warning-subtle)] text-[var(--warning)]">
            <AlertTriangle size={16} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">
              Focus &amp; Growth Areas
            </h3>
            <p className="text-[10px] text-[var(--text-muted)]">
              Initiated topics with low practice or decay
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {weaknesses.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-4 text-center">
              No weak topics detected. Keep practicing across categories!
            </p>
          ) : (
            weaknesses.map(({ subtopic, readiness, categoryTitle, topicTitle }) => (
              <div
                key={subtopic.id}
                className="flex items-center justify-between p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] group"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {subtopic.title}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate">
                    {categoryTitle} &bull; {topicTitle}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-mono font-bold text-[var(--warning)]">
                    {readiness}%
                  </span>
                  {onOpenQuickLog && (
                    <button
                      onClick={() => onOpenQuickLog(subtopic.id)}
                      className="p-1 rounded bg-[var(--accent-subtle)] text-[var(--accent-light)] hover:bg-[var(--accent)] hover:text-white transition-all text-[10px] font-medium flex items-center gap-0.5 cursor-pointer"
                      title="Practice this topic"
                    >
                      <Plus size={11} />
                      <span>Log</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
