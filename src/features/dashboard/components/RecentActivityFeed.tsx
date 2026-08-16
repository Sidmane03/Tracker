import React from 'react'
import { useStore } from '@/store'
import { History, ChevronRight, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivityFeedProps {
  onNavigateToLogs?: () => void
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  onNavigateToLogs,
}) => {
  const { practiceLogs, subtopics, categories } = useStore()

  const recent = practiceLogs.slice(0, 5)

  return (
    <div
      className="p-4 rounded-[var(--radius-lg)] border border-[var(--border)] flex flex-col justify-between"
      style={{ background: 'var(--surface-1)' }}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[var(--accent-subtle)] text-[var(--accent-light)]">
              <History size={16} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                Recent Practice Activity
              </h3>
              <p className="text-[10px] text-[var(--text-muted)]">
                Latest logged study sessions
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToLogs}
            className="text-xs text-[var(--accent-light)] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View all ({practiceLogs.length})</span>
            <ChevronRight size={12} />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-muted)]">
            <BookOpen size={24} className="mx-auto mb-2 opacity-40" />
            <p>No practice logged yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((log) => {
              const sub = subtopics[log.subtopicId]
              const cat = categories[log.categoryId]

              const diffVariant =
                log.difficulty === 'Easy'
                  ? 'success'
                  : log.difficulty === 'Medium'
                  ? 'warning'
                  : 'danger'

              const outVariant =
                log.outcome === 'Solved'
                  ? 'success'
                  : log.outcome === 'Struggled'
                  ? 'warning'
                  : 'accent'

              return (
                <div
                  key={log.id}
                  className="p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[var(--text-primary)] truncate">
                      {sub?.title || log.subtopicId}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mt-0.5">
                      <span>{cat?.title || log.categoryId}</span>
                      <span>&bull;</span>
                      <span>{formatDistanceToNow(log.timestamp, { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge variant={diffVariant}>{log.difficulty}</Badge>
                    <Badge variant={outVariant}>{log.outcome}</Badge>
                    <span className="font-mono text-[var(--text-secondary)] font-medium pl-1">
                      {log.timeSpentMinutes}m
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
