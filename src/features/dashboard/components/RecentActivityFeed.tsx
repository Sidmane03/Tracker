import React from 'react'
import { useStore } from '@/store'
import { ChevronRight } from 'lucide-react'
import { Badge, Card } from '@/components/ui'
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
    <Card className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-light)] opacity-80" />
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">
              Recent Activity
            </h3>
          </div>

          <button
            onClick={onNavigateToLogs}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-light)] flex items-center gap-0.5 cursor-pointer font-medium transition-colors"
          >
            <span>All ({practiceLogs.length})</span>
            <ChevronRight size={12} />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)]">
            No data.
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
                  className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[var(--text-primary)] truncate">
                      {sub?.title || log.subtopicId}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mt-0.5">
                      <span>{cat?.title || log.categoryId}</span>
                      <span>&bull;</span>
                      <span>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge variant={diffVariant}>{log.difficulty}</Badge>
                    <Badge variant={outVariant}>{log.outcome}</Badge>
                    <span className="font-mono text-[var(--text-secondary)] font-medium pl-1 text-[11px]">
                      {log.timeSpentMinutes}m
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}
